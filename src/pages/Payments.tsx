import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOrders } from "@/hooks/useOrders";
import useAuthStore from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentFormData {
  email: string;
  fio: string;
  phone_number: string;
  delivery_address: string;
  isAnotherRecipient: boolean;
}

// Утилита форматирования телефона
const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(
    /^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/,
  );
  if (!match) return value;

  // +7 (XXX) XXX-XX-XX
  const part1 = match[2] ? `(${match[2]}` : "";
  const part2 = match[3] ? `) ${match[3]}` : "";
  const part3 = match[4] ? `-${match[4]}` : "";
  const part4 = match[5] ? `-${match[5]}` : "";

  return !part1 ? "+7" : `+7 ${part1}${part2}${part3}${part4}`;
};

export default function Payments() {
  const { payOrder, loading } = useOrders();
  const { user, isAuthenticated } = useAuthStore();
  const [isAnotherRecipient, setIsAnotherRecipient] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      email: "",
      fio: "",
      phone_number: "",
      delivery_address: "",
      isAnotherRecipient: false,
    },
  });

  // Автозаполнение данных пользователя
  useEffect(() => {
    if (isAuthenticated && user && !isAnotherRecipient) {
      setValue("email", user.email || "");
      setValue("fio", user.fio || "");
      setValue("phone_number", user.phone_number || "");
    } else if (!isAnotherRecipient) {
      // Если пользователь вышел или снял галочку "другой получатель", но не авторизован - можно очистить
      // setValue("email", ""); ...
    }
  }, [isAuthenticated, user, isAnotherRecipient, setValue]);

  // Обработка телефона при вводе
  const phoneValue = watch("phone_number");
  useEffect(() => {
    if (phoneValue && !phoneValue.startsWith("+7")) {
      // Простая защита, чтобы всегда было +7
      setValue("phone_number", formatPhoneNumber(phoneValue));
    }
  }, [phoneValue, setValue]);

  const onSubmit = (data: PaymentFormData) => {
    payOrder({
      email: data.email,
      fio: data.fio,
      phone_number: data.phone_number,
      delivery_address: data.delivery_address,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg border-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#00B3A4] rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-xl text-[#00B3A4]">Sdmedik</span>
          </div>
          <CardTitle className="text-2xl">Оформление заказа</CardTitle>
          <CardDescription>
            Введите данные для доставки и оплаты
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Блок контактов */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Введите email",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Некорректный email",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  placeholder="+7 (999) 000-00-00"
                  {...register("phone_number", {
                    required: "Введите телефон",
                    onChange: (e) => {
                      e.target.value = formatPhoneNumber(e.target.value);
                    },
                  })}
                  className={errors.phone_number ? "border-red-500" : ""}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fio">ФИО Получателя</Label>
                <Input
                  id="fio"
                  placeholder="Иванов Иван Иванович"
                  {...register("fio", { required: "Введите ФИО" })}
                  className={errors.fio ? "border-red-500" : ""}
                />
                {errors.fio && (
                  <p className="text-red-500 text-xs">{errors.fio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес доставки</Label>
                <Input
                  id="address"
                  placeholder="Город, Улица, Дом, Квартира"
                  {...register("delivery_address", {
                    required: "Введите адрес",
                  })}
                  className={errors.delivery_address ? "border-red-500" : ""}
                />
                {errors.delivery_address && (
                  <p className="text-red-500 text-xs">
                    {errors.delivery_address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Чекбокс для другого получателя (только если авторизован) */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="another-recipient"
                  checked={isAnotherRecipient}
                  onCheckedChange={(checked) => {
                    setIsAnotherRecipient(checked as boolean);
                    if (checked) {
                      // Очищаем поля, если выбран другой получатель
                      setValue("fio", "");
                      setValue("phone_number", "");
                      setValue("email", "");
                    } else if (user) {
                      // Возвращаем данные, если сняли галочку
                      setValue("fio", user.fio);
                      setValue("phone_number", user.phone_number);
                      setValue("email", user.email);
                    }
                  }}
                />
                <label
                  htmlFor="another-recipient"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                >
                  Указать другого получателя
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#00B3A4] hover:bg-[#009688] h-11 text-base font-semibold shadow-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Перейти к оплате
                </>
              )}
            </Button>

            <p className="text-xs text-center text-slate-400 mt-4">
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных
              данных
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
