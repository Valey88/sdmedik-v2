// src/hooks/useUser.ts

import api from "@/config/Config";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Не используется, но оставляем
import { toast } from "react-toastify";

interface User {
  id: string;
  email: string;
  fio: string;
  phone_number: string;
  role: string;
  role_id: number;
}

// Интерфейс для элемента в заказе
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  selected_options: any | null; // Используйте более точный тип, если известен
}

// Интерфейс для всего заказа
export interface Order {
  id: string;
  user_id: {
    String: string;
    Valid: boolean;
  };
  email: string;
  phone: string;
  fio: string;
  address: string;
  total_price: number;
  status: string;
  items: OrderItem[];
  created_at: string;
  fragment_link: string;
}

interface UserReturn {
  onMe: () => Promise<User | undefined>;
  onGetOrders: () => Promise<Order[] | undefined>; // Новая функция
  loading: boolean;
  error: string | null;
}

export const useUser = (): UserReturn => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  // 3. ИСПРАВЛЕНИЕ: Удален ненужный аргумент data: User
  const onMe = async (): Promise<User | undefined> => {
    setLoading(true);
    setError(null);

    try {
      // Здесь предполагается, что бэкенд возвращает { status: 'success', data: User }
      const res = await api.get<{ data: User }>("/user/me");

      // Возвращаем данные пользователя
      return res.data.data;
    } catch (err: any) {
      console.error("Ошибка получения данных о пользователе:", err);
      toast.error(
        err.response?.data?.message || "Ошибка получения данных о пользователе"
      );
      setError(err.response?.data?.message || err.message);

      // При ошибке возвращаем undefined
      return undefined;
    } finally {
      // 4. ИСПРАВЛЕНИЕ: Обязательно снимаем состояние загрузки в конце
      setLoading(false);
    }
  };

  const onGetOrders = async (): Promise<Order[] | undefined> => {
    setLoading(true);
    setError(null);

    try {
      // Бэкенд должен вернуть { data: Order[] }
      const res = await api.get<{ data: Order[] }>("/order/my");

      // Возвращаем список заказов
      return res.data.data;
    } catch (err: any) {
      console.error("Ошибка получения заказов:", err);
      toast.error(
        err.response?.data?.message || "Ошибка получения списка заказов"
      );
      setError(err.response?.data?.message || err.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return {
    onMe,
    onGetOrders,
    loading, // Выносим loading
    error, // Выносим error
  };
};
