// src/store/useAuthStore.ts
import { create } from "zustand";
import { toast } from "react-toastify";
import api, { url } from "@/config/Config";
import axios from "axios";

// 1. Расширяем интерфейс User
interface User {
  id: string;
  email: string;
  fio: string;
  phone_number: string;
  role: "admin" | "user"; // Используем литеральные типы для надежности
  role_id: 1 | 2;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isAdmin: boolean; // <-- НОВОЕ: Состояние для проверки на админа

  // Действия
  login: (user: User) => void; // <-- НОВОЕ: Централизованный метод для входа
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hydrate: () => void; // <-- НОВОЕ: Для быстрой загрузки из localStorage
}

const useAuthStore = create<AuthStore>((set, get) => ({
  // Начальные значения
  isAuthenticated: false,
  user: null,
  loading: true, // true, пока не выполнится первая проверка checkAuth
  isAdmin: false,

  /**
   * Централизованный метод для установки состояния аутентификации.
   * Вызывается после успешного логина или проверки сессии.
   */
  login: (userData) => {
    set({
      isAuthenticated: true,
      user: userData,
      // Главная логика: вычисляем isAdmin один раз здесь
      isAdmin: userData.role === "admin" && userData.role_id === 1,
      loading: false,
    });
  },

  /**
   * Выход из системы.
   */
  logout: async () => {
    try {
      // Пытаемся выйти на бэкенде (очистить cookie)
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Ошибка при выходе (возможно, сессия уже недействительна):",
        error
      );
    } finally {
      // Сбрасываем все состояния в начальные значения
      set({
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        loading: false,
      });
      localStorage.removeItem("user"); // Очищаем localStorage
      toast.info("Вы вышли из системы.");
    }
  },

  /**
   * Проверка сессии с бэкендом.
   * Вызывается при загрузке приложения для подтверждения валидности сессии.
   */
  checkAuth: async () => {
    try {
      // Если loading уже false (из-за hydrate), не показываем лоадер снова
      if (!get().loading) set({ loading: true });

      const response = await api.get<User>("/auth/me");

      if (response.data) {
        // Используем наш центральный метод `login`
        get().login(response.data);
        // Синхронизируем localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        // Если ответа нет, но ошибки не было, выходим из системы
        await get().logout();
      }
    } catch (error) {
      // Любая ошибка (401, 500, сеть) означает, что пользователь не авторизован
      console.error("Проверка аутентификации не удалась:", error);
      await get().logout();
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    // Важно: здесь мы делаем запрос.
    // Так как куки HttpOnly, мы просто делаем POST запрос,
    // а сервер сам обновит set-cookie в ответе.

    // Мы используем axios.create(), чтобы создать "чистый" инстанс
    // без наших интерцепторов, чтобы избежать бесконечного цикла,
    // если вдруг сам /refresh вернет 401.
    const refreshApi = axios.create({
      baseURL: url,
      withCredentials: true, // Обязательно для отправки текущих кук
    });

    await refreshApi.post("/auth/refresh");
  },

  /**
   * Мгновенное восстановление состояния из localStorage.
   * Убирает "моргание" интерфейса при перезагрузке страницы.
   */
  hydrate: () => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString) as User;
        // Устанавливаем состояние немедленно, не дожидаясь ответа от сервера
        get().login(userData);
      }
    } catch (e) {
      console.error("Не удалось восстановить сессию из localStorage", e);
      // Если в localStorage мусор, просто ничего не делаем
    } finally {
      // В любом случае, начальная загрузка завершена
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
