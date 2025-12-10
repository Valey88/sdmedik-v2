import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/Auth"; // Убедитесь, что путь правильный
import { toast } from "react-toastify";
import useAuthStore from "@/store/useAuthStore"; // Импортируем стор
import { useNavigate } from "react-router-dom"; // Для навигации
import { User, ShieldCheck, LogOut } from "lucide-react"; // Иконки (опционально)

const CODE_LENGTH = 6;

const UserAuthSheet = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("login");
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Достаем состояние авторизации и данные пользователя
  const { isAuthenticated, user, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const {
    registerLogin,
    handleLoginSubmit,
    loginErrors,
    registerRegister,
    handleRegisterSubmit,
    registerErrors,
    onLogin,
    onRegister,
    onCode,
    onLogout, // Достаем функцию выхода
  } = useAuth();

  // === Фокусировка ===
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, CODE_LENGTH);
  }, []);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  // === Вспомогательные функции ===
  const handleNavigation = (path: string) => {
    setIsOpen(false); // Закрываем панель при переходе
    navigate(path);
  };

  const handleLogoutClick = async () => {
    await onLogout();
    setIsOpen(false);
  };

  // ... (логика ввода кода остается прежней)
  const handleCodeChange = (value: string, index: number) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
    if (cleaned.length > 1) return;
    const newCode = [...code];
    newCode[index] = cleaned;
    setCode(newCode);
    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "");
    const chars = pasted.split("").slice(0, CODE_LENGTH);
    const newCode = [...code];
    chars.forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);
  };

  const handleCodeSubmitInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = code.join("");
    if (codeString.length !== CODE_LENGTH) return;

    const result = await onCode({ code: codeString, email: registeredEmail });
    if (result?.success) {
      toast.success("Регистрация завершена!");
      setStep("form");
      setTab("login");
      setCode(Array(CODE_LENGTH).fill(""));
    } else {
      toast.error("Неверный код!");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep("form");
      setCode(Array(CODE_LENGTH).fill(""));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-6 overflow-y-auto shadow-xl bg-white backdrop-blur"
      >
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <SheetHeader>
            <SheetTitle className="text-teal-600 text-2xl font-semibold text-center">
              {isAuthenticated
                ? `Привет, ${user?.fio?.split(" ")[1] || "Пользователь"}!`
                : "Личный кабинет"}
            </SheetTitle>
          </SheetHeader>

          {/* === УСЛОВНЫЙ РЕНДЕРИНГ === */}
          {isAuthenticated ? (
            // Интерфейс для авторизованного пользователя
            <div className="flex flex-col gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
                <p className="text-gray-500 text-sm">Вы вошли как</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-2 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                    Администратор
                  </span>
                )}
              </div>

              {/* Кнопка Профиль (для всех) */}
              <Button
                onClick={() => handleNavigation("/profile")}
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-lg hover:bg-teal-50 hover:text-teal-700 border-gray-200"
              >
                <User size={20} />
                Мой профиль
              </Button>

              {/* Кнопка Админ Панель (только для админа) */}
              {isAdmin && (
                <Button
                  onClick={() => handleNavigation("/admin")}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 text-lg hover:bg-teal-50 hover:text-teal-700 border-gray-200"
                >
                  <ShieldCheck size={20} />
                  Админ панель
                </Button>
              )}

              <div className="h-px bg-gray-100 my-2" />

              {/* Кнопка Выход */}
              <Button
                onClick={handleLogoutClick}
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut size={20} />
                Выйти
              </Button>
            </div>
          ) : (
            // Интерфейс входа/регистрации (существующий код)
            <Tabs
              defaultValue="login"
              value={tab}
              onValueChange={(v) => {
                setTab(v);
                setStep("form");
                setCode(Array(CODE_LENGTH).fill(""));
              }}
              className="mt-6"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-xl p-0">
                <TabsTrigger
                  value="login"
                  className={`rounded-lg font-medium text-sm transition-all ${
                    tab === "login"
                      ? "bg-teal-500 text-white shadow"
                      : "text-gray-600 hover:text-teal-600"
                  }`}
                >
                  Вход
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className={`rounded-lg font-medium text-sm transition-all ${
                    tab === "register"
                      ? "bg-white text-white shadow"
                      : "text-gray-600 hover:text-teal-600"
                  }`}
                >
                  Регистрация
                </TabsTrigger>
              </TabsList>

              {/* === Вход === */}
              <TabsContent value="login" className="mt-6">
                <form
                  onSubmit={handleLoginSubmit(onLogin)}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-3">
                    <Label>Email</Label>
                    <Input
                      placeholder="your@email.com"
                      {...registerLogin("email", {
                        required: "Введите email",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Некорректный email",
                        },
                      })}
                    />
                    {loginErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label>Пароль</Label>
                    <Input
                      type="password"
                      placeholder="••••••"
                      {...registerLogin("password", {
                        required: "Введите пароль",
                      })}
                    />
                    {loginErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 transition-all rounded-lg shadow"
                  >
                    Войти
                  </Button>
                </form>
              </TabsContent>

              {/* === Регистрация === */}
              <TabsContent value="register" className="mt-6">
                <AnimatePresence mode="wait">
                  {step === "form" && (
                    <motion.form
                      key="register-form"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleRegisterSubmit(async (data) => {
                        const result = await onRegister(data);
                        if (result?.success) {
                          setRegisteredEmail(data.email);
                          setStep("confirm");
                        }
                      })}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-3">
                        <Label>Email</Label>
                        <Input
                          placeholder="your@email.com"
                          {...registerRegister("email", {
                            required: "Введите email",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Некорректный email",
                            },
                          })}
                        />
                        {registerErrors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {registerErrors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label>Телефон</Label>
                        <Input
                          placeholder="+7 (___) ___-__-__"
                          {...registerRegister("phone_number", {
                            required: "Введите телефон",
                          })}
                        />
                        {registerErrors.phone_number && (
                          <p className="text-red-500 text-sm mt-1">
                            {registerErrors.phone_number.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label>ФИО</Label>
                        <Input
                          placeholder="Иванов Иван Иванович"
                          {...registerRegister("fio", {
                            required: "Введите ФИО",
                          })}
                        />
                        {registerErrors.fio && (
                          <p className="text-red-500 text-sm mt-1">
                            {registerErrors.fio.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <Label>Пароль</Label>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...registerRegister("password", {
                            required: "Введите пароль",
                            minLength: {
                              value: 6,
                              message: "Минимум 6 символов",
                            },
                          })}
                        />
                        {registerErrors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {registerErrors.password.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 rounded-lg shadow"
                      >
                        Зарегистрироваться
                      </Button>
                    </motion.form>
                  )}

                  {step === "confirm" && (
                    <motion.form
                      key="confirm-code"
                      onSubmit={handleCodeSubmitInternal}
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center mt-6 space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        Подтверждение почты
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        Введите код подтверждения, отправленный на вашу почту
                      </p>
                      <p className="text-sm text-gray-500">{registeredEmail}</p>

                      <div className="flex gap-3 justify-center mb-6">
                        {code.map((digit, i) => (
                          <input
                            key={i}
                            ref={setInputRef(i)}
                            type="text"
                            inputMode="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleCodeChange(e.target.value, i)
                            }
                            onKeyDown={(e) => handleCodeKeyDown(e, i)}
                            onPaste={handleCodePaste}
                            className="w-12 h-12 bg-white border border-teal-200 rounded-lg text-center text-lg font-semibold focus:border-teal-400 focus:ring-2 focus:ring-teal-300 transition-all outline-none"
                            autoFocus={i === 0}
                          />
                        ))}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 rounded-lg shadow"
                        disabled={code.join("").length !== CODE_LENGTH}
                      >
                        Подтвердить
                      </Button>

                      <button
                        type="button"
                        className="text-sm text-teal-600 hover:text-teal-700"
                        onClick={() => toast.info("Код отправлен повторно")}
                      >
                        Отправить код повторно
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default UserAuthSheet;
