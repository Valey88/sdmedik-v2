import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Хуки и Типы
import { useProducts } from "@/hooks/useProducts";

// Созданные компоненты
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogPagination } from "@/components/CatalogPagination";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { fetchProducts, products, totalCount, loading, error } = useProducts();
  //   const { addProductThisBascket } = useBascketStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>(null);
  const [catalogType, setCatalogType] = useState<string>("1,2");
  const [sortOrder, setSortOrder] = useState<
    "default" | "priceAsc" | "priceDesc"
  >("default");

  const LIMIT = 20;

  // Загрузка данных
  useEffect(() => {
    if (!id) return;
    const offset = (currentPage - 1) * LIMIT;
    const jsonData = filters ? JSON.stringify(filters) : null;

    fetchProducts({
      category_id: id,
      filters: jsonData,
      offset,
      limit: LIMIT,
      catalogs: catalogType,
      searchTerm: "",
      searchArticle: "",
    });
  }, [id, currentPage, filters, catalogType, fetchProducts]);

  // Сортировка на клиенте
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    let items = [...products];
    if (sortOrder === "priceAsc") items.sort((a, b) => a.price - b.price);
    if (sortOrder === "priceDesc") items.sort((a, b) => b.price - a.price);
    return items;
  }, [products, sortOrder]);

  const totalPages = Math.ceil(totalCount / LIMIT);

  //   const handleAddToCart = useCallback(
  //     (prodId: string) => {
  //       addProductThisBascket(prodId, 1);
  //     },
  //     [addProductThisBascket]
  //   );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Сброс на первую страницу
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Каталог товаров
          </h1>
          <p className="text-slate-500">
            Найдено товаров:{" "}
            <span className="font-semibold text-[#00B3A4]">{totalCount}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Сайдбар (Фильтры) */}
          <div className="lg:w-[320px] flex-shrink-0">
            <CatalogFilters
              categoryId={id!}
              onApply={handleApplyFilters}
              isLoading={loading}
            />
          </div>

          {/* Основной контент */}
          <div className="flex-1">
            {/* Контролы (Сортировка, Табы) и Кнопка фильтров для мобилки */}
            <div className="mb-6 flex flex-col gap-4">
              <div className="lg:hidden">
                {/* На мобильном фильтры вызываются внутри Controls или отдельной кнопкой */}
                {/* Но так как CatalogFilters имеет мобильную кнопку внутри себя, она появится автоматически */}
              </div>
              <CatalogControls
                catalogType={catalogType}
                setCatalogType={(v: any) => {
                  setCatalogType(v);
                  setCurrentPage(1);
                }}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>

            {/* Сетка товаров */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="space-y-3 bg-white p-4 rounded-xl border border-slate-100"
                  >
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center border border-red-100">
                <p>Ошибка загрузки: {error}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-xl text-center border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg mb-4">Товары не найдены</p>
                <Button
                  variant="link"
                  onClick={() => setFilters(null)}
                  className="text-[#00B3A4]"
                >
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-500">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    // onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Пагинация */}
            {!loading && sortedProducts.length > 0 && (
              <CatalogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
