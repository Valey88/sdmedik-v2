import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CategoryForm from "@/components/admin/category/CategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const { fetchCategoryId, currentCategory, loading } = useCategories();

  useEffect(() => {
    if (id) {
      fetchCategoryId(id);
    }
  }, [id, fetchCategoryId]);

  if (loading || !currentCategory) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pt-10">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

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
              <BreadcrumbLink href="/admin/categories">
                Категории
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Редактирование</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Редактирование: {currentCategory.name}
        </h1>
      </div>

      <CategoryForm initialData={currentCategory} isEdit />
    </div>
  );
}
