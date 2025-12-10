import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  Info,
  ShoppingBag,
  Truck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { urlPictures } from "@/config/Config";
import { useBasket } from "@/store/useBasket";

// --- Компонент элемента корзины ---
const CartItem = ({ item, onUpdateQuantity, onRemove }: any) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-slate-100 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Изображение */}
      <div className="w-full sm:w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
        <img
          src={`${urlPictures}/${item.image}`}
          alt={item.name}
          className="w-full h-full object-contain mix-blend-multiply p-2"
        />
      </div>

      {/* Информация */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg leading-tight mb-1">
            <Link
              to={`/product/${item.product_id}`}
              className="hover:text-[#00B3A4] transition-colors"
            >
              {item.name}
            </Link>
          </h3>
          <p className="text-sm text-slate-500">{item.brand}</p>
        </div>

        <div className="mt-4 flex items-center justify-between sm:justify-start gap-6">
          <div className="font-bold text-lg text-[#00B3A4]">
            {Number(item.total_price).toLocaleString("ru-RU")} ₽
          </div>

          {/* Контроллер количества */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-9">
            <button
              onClick={() =>
                onUpdateQuantity(item.product_id, "minus", item.iso)
              }
              disabled={item.quantity <= 1}
              className="w-9 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-50 transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="w-12 h-full flex items-center justify-center font-medium text-sm border-x border-slate-200">
              {item.quantity}
            </div>
            <button
              onClick={() =>
                onUpdateQuantity(item.product_id, "plus", item.iso)
              }
              className="w-9 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Кнопка удаления */}
      <div className="flex justify-end sm:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};

// --- Основная страница ---
export default function CartPage() {
  const navigate = useNavigate();

  // Используем методы из нового хука useBasket
  const {
    fetchUserBasket,
    basket, // В новом хуке basket - это уже объект данных, а не { data: ... }
    updateQuantity, // Переименовано из editCountProductBascket
    removeFromBasket, // Переименовано из deleteProductThithBasket
    // loading,
  } = useBasket();

  const [items, setItems] = useState<any[]>([]);

  // Загрузка корзины при монтировании
  useEffect(() => {
    fetchUserBasket();
  }, [fetchUserBasket]);

  // Синхронизация стейта при обновлении basket из хука
  useEffect(() => {
    // В новом хуке данные лежат сразу в basket.items
    if (basket && basket.items) {
      setItems(basket.items);
    } else {
      setItems([]);
    }
  }, [basket]);

  const handleUpdateQuantity = async (
    productId: string,
    action: "plus" | "minus",
    iso: string,
  ) => {
    try {
      // Оптимистичное обновление UI (сразу меняем цифру)
      setItems((prev) =>
        prev.map((item) => {
          if (item.product_id === productId) {
            const newQty =
              action === "plus"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1);
            return { ...item, quantity: newQty };
          }
          return item;
        }),
      );

      // Отправляем запрос через хук
      await updateQuantity(productId, action === "plus" ? 1 : -1, iso);
      // fetchUserBasket вызовется внутри updateQuantity автоматически, но можно вызвать явно если нужно
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleRemove = async (id: string) => {
    await removeFromBasket(id);
    // Стейт обновится через useEffect, когда хук вернет новые данные
  };

  // Расчет итогов (берем напрямую из basket, так как хук возвращает чистый объект)
  const cartTotal = basket.total_price || 0;
  const cartTotalWithPromo = basket.total_price_with_promotion || 0;

  // Если цена с промо-акцией больше 0, считаем её основной, иначе обычную
  const finalTotal = cartTotalWithPromo > 0 ? cartTotalWithPromo : cartTotal;

  const isFreeDelivery = finalTotal >= 5000;

  // Если корзина пуста
  if (!items || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-teal-50 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-[#00B3A4]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Ваша корзина пуста
        </h1>
        <p className="text-slate-500 mb-8 max-w-md">
          Похоже, вы еще ничего не добавили. Перейдите в каталог, чтобы найти
          необходимые товары.
        </p>
        <Link to="/catalog">
          <Button
            size="lg"
            className="bg-[#00B3A4] hover:bg-[#009688] rounded-full px-8"
          >
            Перейти в каталог
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
          Корзина
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Левая колонка: Список товаров */}
          <Card className="flex-1 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Товары ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </CardContent>
          </Card>

          {/* Правая колонка: Итого и Оформление */}
          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6 sticky top-24">
            <Card className="border-slate-200 shadow-lg bg-white overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700">Ваш заказ</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                {/* Суммы */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Товары ({items.length})</span>
                    <span>{cartTotal.toLocaleString()} ₽</span>
                  </div>
                  {cartTotalWithPromo > 0 && cartTotalWithPromo < cartTotal && (
                    <div className="flex justify-between text-red-500">
                      <span>Скидка</span>
                      <span>
                        − {(cartTotal - cartTotalWithPromo).toLocaleString()} ₽
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Доставка</span>
                    <span
                      className={
                        isFreeDelivery ? "text-green-600 font-medium" : ""
                      }
                    >
                      {isFreeDelivery ? "Бесплатно" : "Рассчитывается"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-slate-900">
                    Итого
                  </span>
                  <span className="font-bold text-2xl text-[#00B3A4]">
                    {finalTotal.toLocaleString()} ₽
                  </span>
                </div>

                {!isFreeDelivery && (
                  <div className="bg-orange-50 text-orange-700 text-xs p-2 rounded-md flex items-start gap-2">
                    <Info size={14} className="mt-0.5 flex-shrink-0" />
                    <span>
                      Добавьте товаров на {(5000 - finalTotal).toLocaleString()}{" "}
                      ₽ для бесплатной доставки.
                    </span>
                  </div>
                )}

                <Button
                  className="w-full bg-[#00B3A4] hover:bg-[#009688] h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={() => navigate("/pay")}
                >
                  Перейти к оформлению
                </Button>

                {/* Инфо кнопки (Модалки) */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <InfoDialog
                    title="Условия доставки"
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-9 gap-1"
                      >
                        <Truck size={12} /> Доставка
                      </Button>
                    }
                  >
                    <p>
                      Доставка платная для заказов на сумму менее 5000 ₽. Для
                      заказов на сумму 5000 ₽ и выше доставка бесплатная.
                    </p>
                    <p className="mt-2">
                      Точную стоимость и сроки уточняйте у оператора после
                      оформления заказа.
                    </p>
                  </InfoDialog>

                  <InfoDialog
                    title="Оплата сертификатом"
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-9 gap-1"
                      >
                        <CreditCard size={12} /> Сертификат
                      </Button>
                    }
                  >
                    <p>
                      Вы можете оплатить заказ электронным сертификатом ФСС.
                    </p>
                    <p className="mt-2">
                      При оформлении заказа выберите соответствующий способ
                      оплаты. Если сумма сертификата меньше стоимости товара,
                      разницу можно доплатить картой.
                    </p>
                  </InfoDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательный компонент модалки
function InfoDialog({ title, children, trigger }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#00B3A4]">{title}</DialogTitle>
        </DialogHeader>
        <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
