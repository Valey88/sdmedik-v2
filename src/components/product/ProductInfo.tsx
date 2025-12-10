import { Product } from "@/interface/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RegionSelector from "./RegionSelector";

interface InfoProps {
  product: Product;
  price: number | null; // Разрешаем null для сертификатов без региона
  selectedSize: string;
  setSelectedSize: (v: string) => void;
  selectedColor: string;
  setSelectedColor: (v: string) => void;
  quantity: number;
  setQuantity: (v: number) => void;
  region: string;
  setRegion: (v: string) => void;
  onAddToCart: () => void;
}

export default function ProductInfo({
  product,
  price,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  region,
  setRegion,
  onAddToCart,
}: InfoProps) {
  const sizeChar = product.characteristic.find(
    (c) => c.name.toLowerCase() === "размер",
  );
  const colorChar = product.characteristic.find(
    (c) => c.name.toLowerCase() === "цвет",
  );
  const sizes = Array.isArray(sizeChar?.value) ? sizeChar.value : [];
  const colors = Array.isArray(colorChar?.value) ? colorChar.value : [];

  const isCertificate = product.catalogs === 2;
  const isPriceVisible = price !== null;

  return (
    <div className="bg-white rounded-[24px] shadow-lg shadow-slate-200/50 border border-slate-100 p-6 lg:p-8 space-y-6">
      {/* Верхний блок: Бейджи и Рейтинг (если нужен) */}
      <div className="flex justify-between items-start">
        {isCertificate && (
          <Badge
            variant="secondary"
            className="text-[#00B3A4] bg-teal-50 border-teal-100 hover:bg-teal-100"
          >
            Электронный сертификат
          </Badge>
        )}
      </div>

      {/* Цена или Предупреждение */}
      <div>
        <div className="min-h-[3rem] flex items-center">
          {isPriceVisible ? (
            <div className="flex items-baseline gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {Number(price).toLocaleString("ru-RU")} ₽
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl text-sm font-medium border border-amber-100 w-full animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Выберите регион, чтобы узнать цену</span>
            </div>
          )}
        </div>
      </div>

      {/* Выбор региона (Только для сертификатов) */}
      {isCertificate && (
        <div
          className={cn(
            "transition-all duration-300 rounded-2xl border p-4",
            !region
              ? "bg-teal-50 border-[#00B3A4] ring-2 ring-teal-100 shadow-sm"
              : "bg-slate-50 border-slate-100",
          )}
        >
          <RegionSelector selectedRegion={region} onRegionChange={setRegion} />
          {!region && (
            <p className="text-xs text-[#00B3A4] mt-2 font-semibold">
              ↑ Обязательное поле для расчета компенсации
            </p>
          )}
        </div>
      )}

      <Separator className="bg-slate-100" />

      {/* Размеры (Скрываем, если сертификат, или показываем по логике) */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-900">Размер</span>
            {selectedSize && (
              <span className="text-slate-500 font-medium">{selectedSize}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-[3.5rem] px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-200",
                  selectedSize === size
                    ? "border-[#00B3A4] bg-[#00B3A4] text-white shadow-md shadow-teal-200"
                    : "border-slate-200 text-slate-600 hover:border-[#00B3A4]/50 hover:bg-slate-50 bg-white",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Цвета */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-bold text-slate-900">Цвет</span>
            {selectedColor && (
              <span className="text-slate-500 font-medium">
                {selectedColor}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200",
                  selectedColor === color
                    ? "border-[#00B3A4] bg-[#00B3A4] text-white shadow-md shadow-teal-200"
                    : "border-slate-200 text-slate-600 hover:border-[#00B3A4]/50 hover:bg-slate-50 bg-white",
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кнопки действия (Блокируем, если нет цены) */}
      <div
        className={cn(
          "flex gap-3 transition-all duration-300",
          !isPriceVisible && "opacity-50 pointer-events-none grayscale",
        )}
      >
        {/* Счетчик */}
        <div className="flex items-center border border-slate-200 rounded-xl h-12 w-36 px-1 bg-white shadow-sm">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
          >
            -
          </button>
          <div className="flex-1 text-center font-bold text-slate-900 text-lg">
            {quantity}
          </div>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
          >
            +
          </button>
        </div>

        {/* Кнопка купить */}
        <Button
          className="flex-1 h-12 text-base font-bold bg-[#00B3A4] hover:bg-[#009a8d] shadow-lg shadow-teal-200/50 rounded-xl transition-all hover:-translate-y-0.5"
          onClick={onAddToCart}
          disabled={!isPriceVisible}
        >
          <ShoppingCart className="mr-2 h-5 w-5" strokeWidth={2.5} /> В корзину
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
        >
          <Heart className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      </div>

      {/* Инфо-блок (Trust Badges) */}
      <div className="bg-slate-50/80 rounded-2xl p-4 space-y-4 text-sm text-slate-600 border border-slate-100">
        <div className="flex gap-3 items-start">
          <Truck className="w-5 h-5 text-[#00B3A4] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">
              Быстрая доставка
            </span>
            <span className="text-xs text-slate-500">
              Курьером или в пункт выдачи от 2 дней
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <ShieldCheck className="w-5 h-5 text-[#00B3A4] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">
              Гарантия качества
            </span>
            <span className="text-xs text-slate-500">
              Официальная гарантия производителя
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <CheckCircle2 className="w-5 h-5 text-[#00B3A4] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">В наличии</span>
            <span className="text-xs text-green-600 font-medium">
              Товар на складе
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
