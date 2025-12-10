import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts"; // Твой обновленный хук
import { urlPictures } from "@/config/Config";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ChevronRight } from "lucide-react";

// Импорт компонентов
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import { useBasket } from "@/store/useBasket";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { fetchProductById, currentProduct, loading } = useProducts();
  const { addToBasket } = useBasket();

  // Локальные стейты
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [region, setRegion] = useState<string>("");

  // 1. Первичная загрузка товара
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // 2. Автовыбор первых опций (Размер/Цвет) для обычных товаров
  useEffect(() => {
    if (currentProduct?.characteristic) {
      const setFirstOption = (name: string, setter: (v: string) => void) => {
        const char = currentProduct.characteristic.find(
          (c) => c.name.toLowerCase() === name,
        );
        if (char && Array.isArray(char.value) && char.value.length > 0) {
          setter(char.value[0]);
        }
      };

      // Если опция еще не выбрана, выбираем первую
      if (!selectedSize) setFirstOption("размер", setSelectedSize);
      if (!selectedColor) setFirstOption("цвет", setSelectedColor);
    }
  }, [currentProduct, selectedSize, selectedColor]);

  // 3. Обработчик смены региона (Логика сертификата)
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    // Если это товар по сертификату, перезапрашиваем данные с ISO
    if (id && currentProduct?.catalogs === 2) {
      fetchProductById(id, newRegion);
    }
  };

  // 4. Расчет отображаемой цены
  const currentPrice = (() => {
    if (!currentProduct) return 0;

    // --- ЛОГИКА ЭЛЕКТРОННОГО СЕРТИФИКАТА ---
    if (currentProduct.catalogs === 2) {
      // Если регион не выбран -> null (чтобы скрыть цену)
      if (!region) return null;
      // Если регион выбран -> берем цену из certificate_price (пришедшую с бэка)
      return currentProduct.certificate_price || 0;
    }

    // --- ЛОГИКА ОБЫЧНОГО ТОВАРА ---
    const sizeChar = currentProduct.characteristic.find(
      (c) => c.name.toLowerCase() === "размер",
    );
    // Если есть наценка за размер
    if (sizeChar?.prices && Array.isArray(sizeChar.value)) {
      const index = sizeChar.value.indexOf(selectedSize);
      if (index !== -1 && sizeChar.prices[index]) {
        return sizeChar.prices[index];
      }
    }
    // Базовая цена
    return currentProduct.price;
  })();

  const handleAddToCart = () => {
    if (!currentProduct) return;

    const dynamicOptions:{ id: number; value: string }[]  = [];
    const addOption = (name: string, value: string) => {
      const char = currentProduct.characteristic.find(
        (c) => c.name.toLowerCase() === name,
      );
      if (char) dynamicOptions.push({ id: char.id, value });
    };

    if (selectedSize) addOption("размер", selectedSize);
    if (selectedColor) addOption("цвет", selectedColor);

    addToBasket({
      product_id: currentProduct.id,
      quantity,
      dynamic_options: dynamicOptions.length > 0 ? dynamicOptions : null,
      iso: region || null,
    });
  };

  // Лоадер
  if (loading && !currentProduct) {
    return <ProductSkeleton />;
  }

  if (!currentProduct)
    return <div className="p-10 text-center">Товар не найден</div>;

  const category = currentProduct.categories?.[0];
  const images = currentProduct.images.map(
    (img) => `${urlPictures}/${img.name}`,
  );

  return (
    <div className="bg-[#F9FAFB] min-h-screen font-sans text-slate-900 pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-6 max-w-7xl">
        {/* Хлебные крошки */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-xs sm:text-sm text-slate-500">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="hover:text-[#00B3A4] transition"
              >
                Главная
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-3.5 h-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/catalog"
                className="hover:text-[#00B3A4] transition"
              >
                Каталог
              </BreadcrumbLink>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-3.5 h-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/catalog/${category.id}`}
                    className="hover:text-[#00B3A4] transition"
                  >
                    {category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator>
              <ChevronRight className="w-3.5 h-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbPage className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {currentProduct.name}
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Заголовок */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 text-slate-900">
            {currentProduct.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-slate-700">4.9</span>
              <span className="text-slate-400 text-xs ml-1">(12 отзывов)</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono">
              Арт: {currentProduct.article || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ЛЕВАЯ ЧАСТЬ: Галерея и Табы */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <ProductGallery
                images={images}
                productName={currentProduct.name}
              />
            </div>

            <div className="hidden lg:block">
              <ProductTabs product={currentProduct} />
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Sticky Info Block */}
          <div className="lg:col-span-5 xl:col-span-4 relative">
            <div className="sticky top-24 z-10">
              <ProductInfo
                product={currentProduct}
                price={currentPrice} // Здесь может быть null!
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                quantity={quantity}
                setQuantity={setQuantity}
                region={region}
                setRegion={handleRegionChange} // Передаем обработчик
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Табы для мобильных (внизу) */}
          <div className="lg:hidden col-span-1">
            <ProductTabs product={currentProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="container px-4 py-8 space-y-8">
    <Skeleton className="h-8 w-1/2 mb-8" />
    <div className="grid lg:grid-cols-2 gap-8">
      <Skeleton className="h-[500px] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-64 w-full rounded-2xl mt-8" />
      </div>
    </div>
  </div>
);
