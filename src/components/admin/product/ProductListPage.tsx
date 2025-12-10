import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  X,
  Filter,
} from "lucide-react";

// Хуки
import { useProducts } from "@/hooks/useProducts";
import { useAdmin } from "@/hooks/useAdmin";
import { useCategories } from "@/hooks/useCategories"; // Хук для категорий
import { urlPictures } from "@/config/Config";

export default function ProductListPage() {
  // --- Состояния фильтров ---
  const [searchName, setSearchName] = useState("");
  const [searchArticle, setSearchArticle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // --- Состояния пагинации и удаления ---
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const itemsPerPage = 20;

  // --- Подключение хуков ---
  const { fetchProducts, products, loading, totalCount } = useProducts();
  const { categories, refetch: fetchCategories } = useCategories(); // Загружаем категории
  const { deleteProduct, loading: deleteLoading } = useAdmin();

  // 1. Загрузка категорий при монтаже
  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Основной эффект для загрузки товаров (с Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts({
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        catalogs: "1,2", // Загружаем оба каталога
        searchTerm: searchName, // Фильтр по имени
        searchArticle: searchArticle, // Фильтр по артикулу
        category_id: selectedCategory === "all" ? undefined : selectedCategory, // Фильтр по категории
      });
    }, 500); // Задержка 500мс

    return () => clearTimeout(timer);
  }, [fetchProducts, searchName, searchArticle, selectedCategory, currentPage]);

  // --- Хендлеры ---

  const handleResetFilters = () => {
    setSearchName("");
    setSearchArticle("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      const success = await deleteProduct(deleteId);
      if (success) {
        // Перезагружаем текущую страницу
        fetchProducts({
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          catalogs: "1,2",
          searchTerm: searchName,
          searchArticle: searchArticle,
          category_id:
            selectedCategory === "all" ? undefined : selectedCategory,
        });
      }
      setDeleteId(null);
    }
  };

  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* --- Заголовок и кнопка добавления --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Товары
          </h1>
          <p className="text-slate-500 mt-1">
            Всего товаров:{" "}
            <span className="font-medium text-[#00B3A4]">{totalCount}</span>
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button className="bg-[#00B3A4] hover:bg-[#009688] text-white shadow-md hover:shadow-lg transition-all">
            <Plus className="mr-2 h-4 w-4" /> Добавить товар
          </Button>
        </Link>
      </div>

      {/* --- Панель Фильтров --- */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium mb-2">
          <Filter className="h-4 w-4" /> Фильтры
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 1. Поиск по названию */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по названию..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-slate-50 border-slate-200 focus:border-[#00B3A4] focus:ring-[#00B3A4]"
            />
          </div>

          {/* 2. Поиск по артикулу */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по артикулу..."
              value={searchArticle}
              onChange={(e) => {
                setSearchArticle(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-slate-50 border-slate-200 focus:border-[#00B3A4] focus:ring-[#00B3A4]"
            />
          </div>

          {/* 3. Фильтр по категории */}
          <div>
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                setSelectedCategory(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-[#00B3A4]">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Кнопка сброса */}
          <div>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
            >
              <X className="mr-2 h-4 w-4" /> Сбросить
            </Button>
          </div>
        </div>
      </div>

      {/* --- Таблица --- */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[80px] text-xs uppercase tracking-wider font-semibold">
                Фото
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold">
                Название
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold hidden md:table-cell">
                Артикул
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold hidden md:table-cell">
                Категория
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold">
                Цена
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider font-semibold w-[140px]">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-12 w-12 bg-slate-100 rounded-lg animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                      <Package className="h-10 w-10 text-slate-300" />
                    </div>
                    <p className="text-lg font-medium text-slate-700">
                      Товары не найдены
                    </p>
                    <p className="text-sm text-slate-400">
                      Попробуйте изменить параметры поиска
                    </p>
                    <Button
                      variant="link"
                      onClick={handleResetFilters}
                      className="mt-2 text-[#00B3A4]"
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  {/* Фото */}
                  <TableCell>
                    <div className="h-14 w-14 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                      {product.images && product.images[0] ? (
                        <img
                          src={`${urlPictures}/${product.images[0].name}`}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                  </TableCell>

                  {/* Название */}
                  <TableCell>
                    <div className="flex flex-col max-w-[300px]">
                      <span
                        className="font-semibold text-slate-800 line-clamp-2 leading-tight"
                        title={product.name}
                      >
                        {product.name}
                      </span>
                      {/* Для мобилки показываем артикул тут */}
                      <span className="text-xs text-slate-400 md:hidden mt-1 font-mono">
                        {product.article || "Без артикула"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Артикул (Десктоп) */}
                  <TableCell className="hidden md:table-cell text-slate-600 font-mono text-sm">
                    {product.article || "—"}
                  </TableCell>

                  {/* Категория */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {/* Проверяем, есть ли категории (массив или объект) */}
                      {Array.isArray(product.categories) &&
                      product.categories.length > 0 ? (
                        product.categories.map((cat: any) => (
                          <Badge
                            key={cat.id}
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 font-normal whitespace-nowrap px-2"
                          >
                            {cat.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm italic">
                          Без категории
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Цена */}
                  <TableCell>
                    <span className="font-bold text-[#00B3A4] whitespace-nowrap text-base">
                      {Number(product.price).toLocaleString("ru-RU")} ₽
                    </span>
                  </TableCell>

                  {/* КНОПКИ ДЕЙСТВИЯ (ОТКРЫТЫЕ) */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/products/${product.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        onClick={() => setDeleteId(String(product.id))}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Пагинация --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium text-slate-600">
            Страница {currentPage} из {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* --- Модалка удаления --- */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет безвозвратно удален из
              базы данных, включая все связанные изображения.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
