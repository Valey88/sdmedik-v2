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
  Edit2,
  Trash2,
  Layers,
  Image as ImageIcon,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCategories } from "@/hooks/useCategories";
import { useAdmin } from "@/hooks/useAdmin";
import { urlPictures } from "@/config/Config";

export default function CategoriesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Используем новые хуки
  const { categories, loading, refetch } = useCategories();
  const { deleteCategory, loading: deleteLoading } = useAdmin();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Фильтрация на клиенте (обычно категорий не так много, чтобы делать серверный поиск)
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      const success = await deleteCategory(deleteId);
      if (success) {
        refetch(); // Обновляем список после удаления
      }
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* --- Заголовок --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Категории
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Управление структурой каталога ({categories.length} шт.)
          </p>
        </div>
        <Link to="/admin/category/new">
          <Button className="bg-[#00B3A4] hover:bg-[#009688] text-white shadow-sm transition-all h-10 px-6 rounded-lg font-medium">
            <Plus className="mr-2 h-4 w-4" /> Добавить категорию
          </Button>
        </Link>
      </div>

      {/* --- Поиск --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск категорий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-slate-50 border-slate-200 focus:border-[#00B3A4] focus:ring-[#00B3A4] rounded-lg"
          />
        </div>
      </div>

      {/* --- Таблица --- */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px] py-4 pl-6 text-xs uppercase tracking-wider font-semibold text-slate-500">
                Фото
              </TableHead>
              <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold text-slate-500">
                Название
              </TableHead>
              <TableHead className="hidden md:table-cell py-4 text-xs uppercase tracking-wider font-semibold text-slate-500">
                Характеристики
              </TableHead>
              <TableHead className="py-4 pr-6 text-right text-xs uppercase tracking-wider font-semibold text-slate-500">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow
                  key={i}
                  className="border-b border-slate-100 last:border-0"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-lg animate-pulse" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-4">
                    <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="py-4" />
                </TableRow>
              ))
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                      <Layers className="h-10 w-10 text-slate-300" />
                    </div>
                    <p className="text-lg font-medium text-slate-700">
                      Категории не найдены
                    </p>
                    {searchTerm && (
                      <p className="text-sm text-slate-400 mt-1">
                        Попробуйте изменить запрос
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className="group hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0"
                >
                  {/* Фото */}
                  <TableCell className="pl-6 py-4">
                    <div className="h-12 w-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center relative shadow-sm">
                      {category.images && category.images[0] ? (
                        <img
                          src={`${urlPictures}/${category.images[0].name}`}
                          alt={category.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                  </TableCell>

                  {/* Название */}
                  <TableCell className="py-4">
                    <span className="font-semibold text-slate-900 text-base">
                      {category.name}
                    </span>
                  </TableCell>

                  {/* Характеристики */}
                  <TableCell className="hidden md:table-cell py-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-normal border border-slate-200"
                      >
                        {category.characteristic?.length || 0} шт.
                      </Badge>
                      <span className="text-xs text-slate-400">параметров</span>
                    </div>
                  </TableCell>

                  {/* Действия */}
                  <TableCell className="pr-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/category/${category.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(String(category.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Мобильное меню (на случай узкого экрана) */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link to={`/admin/category/${category.id}/edit`}>
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" /> Редактировать
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(String(category.id))}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Модалка удаления --- */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Это действие нельзя отменить. Удаление категории может повлиять на
              товары, привязанные к ней.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLoading}
              className="rounded-lg h-10 border-slate-200"
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-10 px-6"
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
