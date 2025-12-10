import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Добавил useNavigate
import ProductForm from "@/components/admin/product/ProductForm";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Добавил Button
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProductById, currentProduct, loading, error } = useProducts(); // Достал error

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // 1. Состояние загрузки
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  // 2. Состояние ошибки или "не найдено"
  if (!currentProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-slate-700">
          {error || "Товар не найден или данные не загрузились"}
        </h2>
        <p className="text-slate-500">
          Проверьте консоль (F12) на наличие ошибок структуры данных.
        </p>
        <Button onClick={() => navigate("/admin/products")}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  // 3. Успешный рендер
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Админ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Товары</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Редактирование</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Редактирование: {currentProduct.name}
        </h1>
      </div>

      <ProductForm initialData={currentProduct} isEdit />
    </div>
  );
}
