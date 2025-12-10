import { useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";

// --- Конфигурация статусов ---
const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "В ожидании", color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "В обработке", color: "bg-blue-100 text-blue-700" },
  paid: { label: "Оплачен", color: "bg-green-100 text-green-700" },
  completed: { label: "Завершен", color: "bg-teal-100 text-teal-700" },
  cancelled: { label: "Отменен", color: "bg-red-100 text-red-700" },
};

export default function DashboardPage() {
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const {
    users,
    totalCount: usersCount,
    loading: usersLoading,
    fetchUsers,
  } = useUsers();

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [fetchOrders, fetchUsers]);

  // --- Вычисления статистики ---

  // 1. Статусы заказов
  const statusStats = useMemo(() => {
    const stats = {
      pending: 0,
      processing: 0,
      paid: 0,
      completed: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      const status = order.status as keyof typeof stats;
      if (stats[status] !== undefined) {
        stats[status]++;
      }
    });
    return stats;
  }, [orders]);

  // 2. Общая выручка (сумма завершенных или оплаченных заказов)
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "completed" || o.status === "paid")
      .reduce((sum, o) => sum + (o.total_price || 0), 0);
  }, [orders]);

  // 3. Данные для графика роста пользователей
  const userGrowthData = useMemo(() => {
    return users.map((user, index) => ({
      name: `User ${index + 1}`,
      count: index + 1,
      date: user.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : "",
    }));
  }, [users]);

  // 4. Последние заказы (для списка)
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      )
      .slice(0, 5);
  }, [orders]);

  const isLoading = ordersLoading || usersLoading;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Дашборд
        </h1>
        <p className="text-slate-500">Обзор ключевых показателей магазина</p>
      </div>

      {/* Карточки верхней статистики */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего заказов"
          value={orders.length}
          icon={ShoppingCart}
          description="За все время"
          loading={isLoading}
        />
        <StatCard
          title="Выручка"
          value={`₽ ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="Оплаченные и завершенные"
          loading={isLoading}
        />
        <StatCard
          title="Пользователи"
          value={usersCount}
          icon={Users}
          description="Зарегистрированных"
          loading={isLoading}
        />
        <StatCard
          title="В обработке"
          value={statusStats.processing + statusStats.pending}
          icon={Activity}
          description="Требуют внимания"
          loading={isLoading}
        />
      </div>

      {/* Основной контент: График и Статусы */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* График роста пользователей */}
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Рост аудитории</CardTitle>
            <CardDescription>
              Динамика регистрации новых пользователей
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Skeleton className="h-[250px] w-[90%]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userGrowthData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00B3A4"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00B3A4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "#00B3A4" }}
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#00B3A4"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Статусы заказов (Детально) */}
        <Card className="col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Статус заказов</CardTitle>
            <CardDescription>Текущее распределение по этапам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatusItem
                label="В ожидании"
                count={statusStats.pending}
                icon={Clock}
                color="text-yellow-500"
                bg="bg-yellow-50"
              />
              <StatusItem
                label="В обработке"
                count={statusStats.processing}
                icon={Activity}
                color="text-blue-500"
                bg="bg-blue-50"
              />
              <StatusItem
                label="Оплачено"
                count={statusStats.paid}
                icon={DollarSign}
                color="text-green-500"
                bg="bg-green-50"
              />
              <StatusItem
                label="Завершено"
                count={statusStats.completed}
                icon={CheckCircle2}
                color="text-teal-600"
                bg="bg-teal-50"
              />
              <StatusItem
                label="Отменено"
                count={statusStats.cancelled}
                icon={XCircle}
                color="text-red-500"
                bg="bg-red-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Последние заказы */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Последние поступления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const status = statusConfig[order.status] || {
                  label: order.status,
                  color: "bg-slate-100 text-slate-700",
                };

                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">
                        {order.fio || "Без имени"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.email} •{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}
                      >
                        {status.label}
                      </div>
                      <div className="font-bold text-slate-900 w-24 text-right">
                        {order.total_price.toLocaleString()} ₽
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-slate-500">Заказов пока нет</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Вспомогательные компоненты ---

function StatCard({ title, value, icon: Icon, description, loading }: any) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-[#00B3A4]`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <div className="text-2xl font-bold text-slate-900">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusItem({ label, count, icon: Icon, color, bg }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className="font-bold text-slate-900">{count}</span>
    </div>
  );
}
