// src/hooks/useAuth.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "@/config/Config";
import useAuthStore from "@/store/useAuthStore";
import { useUser } from "./User";

interface LoginFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues {
  email: string;
  password: string;
  fio: string;
  phone_number: string;
}

interface CodeFormValues {
  code: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

interface UseAuthReturn {
  loading: boolean;
  error: string | null;

  registerLogin: ReturnType<typeof useForm<LoginFormValues>>["register"];
  handleLoginSubmit: ReturnType<
    typeof useForm<LoginFormValues>
  >["handleSubmit"];
  loginErrors: ReturnType<
    typeof useForm<LoginFormValues>
  >["formState"]["errors"];

  registerRegister: ReturnType<typeof useForm<RegisterFormValues>>["register"];
  handleRegisterSubmit: ReturnType<
    typeof useForm<RegisterFormValues>
  >["handleSubmit"];
  registerErrors: ReturnType<
    typeof useForm<RegisterFormValues>
  >["formState"]["errors"];

  registerCode: ReturnType<typeof useForm<CodeFormValues>>["register"];
  handleCodeSubmit: ReturnType<typeof useForm<CodeFormValues>>["handleSubmit"];
  codeErrors: ReturnType<typeof useForm<CodeFormValues>>["formState"]["errors"];

  // действия
  onLogin: (data: LoginFormValues) => Promise<void>;
  onRegister: (data: RegisterFormValues) => Promise<ApiResponse>;
  onCode: (data: CodeFormValues) => Promise<ApiResponse>;
  onResetPassword: (email: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { onMe } = useUser();
  // ===== Форма логина =====
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>();

  // ===== Форма регистрации =====
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>();

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<CodeFormValues>();

  // ======== API вызовы ========

  const onLogin = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      // API запрос на вход
      const res = await api.post("/auth/login", data);

      if (res.data.status === "success") {
        // Бэкенд установил httpOnly куки.
        toast.success("Вы успешно вошли!");
        const userData = await onMe(); // <-- Ждем результат от onMe

        // 3. Если данные получены, сохраняем их
        if (userData) {
          // Сохраняем в localStorage для восстановления сессии после перезагрузки
          localStorage.setItem("user", JSON.stringify(userData));

          // Обновляем глобальное состояние (Zustand)
          useAuthStore.getState().login(userData);
        }

        navigate("/profile");
      }
    } catch (err: any) {
      console.error("Ошибка входа:", err);
      toast.error(err.response?.data?.message || "Ошибка авторизации");
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormValues): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", data);

      if (res.data.status === "success") {
        toast.info("Проверьте email для подтверждения.");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      toast.error(err.response?.data?.message || "Ошибка регистрации");
      setError(err.response?.data?.message || err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const onCode = async (data: CodeFormValues): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/verify-code", data);

      if (res.data.status === "success") {
        toast.success("Email успешно подтверждён!");
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err: any) {
      console.error("Ошибка подтверждения кода:", err);
      toast.error(err.response?.data?.message || "Ошибка подтверждения кода");
      setError(err.response?.data?.message || err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (email: string) => {
    if (!email) {
      setError("Введите email");
      toast.error("Введите email для сброса пароля");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/auth/reset-password/${email}`);
      if (res.data.status === "success") {
        toast.info("Проверьте почту для восстановления пароля");
      }
    } catch (err: any) {
      console.error("Ошибка сброса пароля:", err);
      toast.error(err.response?.data?.message || "Ошибка сброса пароля");
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    localStorage.removeItem("user");
    await useAuthStore.getState().logout();
    navigate("/");
  };

  return {
    loading,
    error,
    registerLogin,
    handleLoginSubmit,
    loginErrors,
    registerRegister,
    handleRegisterSubmit,
    registerErrors,
    registerCode,
    handleCodeSubmit,
    codeErrors,
    onLogin,
    onRegister,
    onResetPassword,
    onCode,
    onLogout,
  };
};
