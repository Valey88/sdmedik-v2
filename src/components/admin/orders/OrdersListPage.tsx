import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  Filter,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useOrders, Order } from "@/hooks/useOrders"; // Твой хук
import { useNavigate } from "react-router-dom";

// Цвета и названия статусов
const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "В ожидании", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Рассмотрен", color: "bg-blue-100 text-blue-800" },
  paid: { label: "Оплачен", color: "bg-green-100 text-green-800" },
  completed: { label: "Завершен", color: "bg-teal-100 text-teal-800" },
  cancelled: { label: "Отменен", color: "bg-red-100 text-red-800" },
};

export default function OrdersListPage() {
  const { fetchOrders, orders, changeStatus, loading } = useOrders();
  const navigate = useNavigate();

  // Локальные стейты
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // Модалка деталей заказа
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Фильтрация и сортировка
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.fio?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          String(o.id).includes(q),
      );
    }

    result.sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "created_at") {
        return sortConfig.direction === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // Сортировка строк/чисел
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery, sortConfig]);

  // Пагинация
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleStatusChange = async (
    orderId: string | number,
    newStatus: string,
  ) => {
    await changeStatus(orderId, newStatus);
    // Обновление selectedOrder, если он открыт
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
  };

  const handleChat = (order: Order) => {
    if (!order.fragment_link) return;
    try {
      const url = new URL(order.fragment_link);
      const fragmentId = url.searchParams.get("fragment");
      const chatId = url.searchParams.get("chat_id");
      if (chatId && fragmentId) {
        navigate(`/admin/admin_chat?chat_id=${chatId}&fragment=${fragmentId}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportToExcel = () => {
    const data = filteredOrders.map((order) => ({
      ID: order.id,
      ФИО: order.fio,
      Email: order.email,
      Телефон: order.phone,
      Статус: statusConfig[order.status]?.label || order.status,
      Сумма: order.total_price,
      Дата: new Date(order.created_at).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Заказы");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  // Статистика для карточек
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const profit = filteredOrders.reduce(
      (acc, o) => acc + (o.total_price || 0),
      0,
    );
    const pending = filteredOrders.filter((o) => o.status === "pending").length;
    return { total, profit, pending };
  }, [filteredOrders]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Заказы
          </h1>
          <p className="text-slate-500">Управление заказами и статусами</p>
        </div>
        <Button variant="outline" onClick={exportToExcel} className="gap-2">
          <Download className="h-4 w-4" /> Экспорт Excel
        </Button>
      </div>

      {/* Карточки статистики (быстрый обзор) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Всего заказов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Общая выручка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00B3A4]">
              {stats.profit.toLocaleString()} ₽
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Новых заказов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Панель фильтров */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по имени, email, телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-slate-50">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(statusConfig).map(([key, conf]) => (
                <SelectItem key={key} value={key}>
                  {conf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-slate-500">На странице:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => setItemsPerPage(Number(v))}
          >
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Таблица */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead
                className="w-[100px] cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("id")}
              >
                ID <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("created_at")}
              >
                Дата <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("fio")}
              >
                Клиент <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("total_price")}
              >
                Сумма <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={7}
                    className="h-16 text-center animate-pulse bg-slate-50/50"
                  />
                </TableRow>
              ))
            ) : currentOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-slate-500"
                >
                  Заказы не найдены
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 group">
                  <TableCell className="font-mono text-xs text-slate-500">
                    #{String(order.id).slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">
                      {order.fio || "Без имени"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-500 flex flex-col">
                      <span>{order.email}</span>
                      <span>{order.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[#00B3A4] whitespace-nowrap">
                    {order.total_price.toLocaleString()} ₽
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusConfig[order.status]?.color || "bg-gray-100 text-gray-800"} border-none font-normal`}
                    >
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        className="h-8 w-8 text-slate-500 hover:white"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      {order.fragment_link && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleChat(order)}
                          className="h-8 w-8 text-slate-500 hover:text-white"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-slate-600">
          Страница {currentPage} из {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Модалка деталей заказа */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Заказ #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Детальная информация о заказе</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6 py-4">
              {/* Инфо о клиенте */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                <div>
                  <p className="text-xs text-slate-500">Клиент</p>
                  <p className="font-medium">{selectedOrder.fio}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                  <p className="text-sm text-blue-600">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Адрес доставки</p>
                  <p className="text-sm">
                    {selectedOrder.address || "Не указан"}
                  </p>
                </div>
              </div>

              {/* Управление статусом */}
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Статус заказа:</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) =>
                    handleStatusChange(String(selectedOrder.id), val)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, conf]) => (
                      <SelectItem key={key} value={key}>
                        {conf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Товары */}
              <div>
                <h4 className="font-semibold mb-3">Состав заказа</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Название</TableHead>
                        <TableHead className="text-right">Кол-во</TableHead>
                        <TableHead className="text-right">Цена</TableHead>
                        <TableHead className="text-right">Итого</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            {item.selected_options &&
                              item.selected_options.length > 0 && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {item.selected_options
                                    .map(
                                      (opt: any) =>
                                        `${opt.name || "Опция"}: ${opt.value}`,
                                    )
                                    .join(", ")}
                                </div>
                              )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.price} ₽
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {item.total_price} ₽
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Итого */}
              <div className="flex justify-end text-xl font-bold">
                Итого:{" "}
                <span className="text-[#00B3A4] ml-2">
                  {selectedOrder.total_price.toLocaleString()} ₽
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
