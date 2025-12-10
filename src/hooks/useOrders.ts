import { useState, useCallback } from "react";
import api from "@/config/Config";
import { toast } from "react-toastify";

// --- ИНТЕРФЕЙСЫ ---

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  selected_options?: any[]; // Если есть опции
}

export interface Order {
  id: string | number;
  fio: string;
  email: string;
  phone: string;
  address?: string;
  total_price: number;
  status: string; // 'pending' | 'processing' | 'paid' | 'completed' | 'cancelled'
  created_at: string;
  items: OrderItem[];
  fragment_link?: string;
  payment_url?: string;
}

export interface PaymentData {
  email: string;
  fio: string;
  phone_number: string;
  delivery_address: string;
}

interface OrdersResponse {
  data: Order[];
  status: string;
}

// --- ХУК ---

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Все заказы (для админа)
  const [userOrders, setUserOrders] = useState<Order[]>([]); // Заказы пользователя
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Получение всех заказов (Админ)
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<OrdersResponse>("/order");

      if (response.data) {
        // Учитываем разную структуру ответа (иногда data.data, иногда data)
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setOrders(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Получение заказов текущего пользователя (Личный кабинет)
  const fetchUserOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<OrdersResponse>("/order/my");

      if (response.data) {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setUserOrders(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching user orders:", err);
      // Не всегда нужно показывать ошибку, если заказов просто нет
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Создание и оплата нового заказа
  const payOrder = useCallback(async (data: PaymentData) => {
    try {
      setLoading(true);
      const response = await api.post("/order", {
        email: data.email,
        fio: data.fio,
        phone_number: data.phone_number,
        address: data.delivery_address,
      });

      if (response.data.status === "success" && response.data.data.url) {
        // Редирект на платежный шлюз
        window.location.href = response.data.data.url;
      } else {
        toast.error("Не удалось получить ссылку на оплату");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Ошибка при создании заказа";
      console.error("Payment error:", err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Оплата существующего заказа по ID (если оплата не прошла сразу)
  const payOrderById = useCallback(
    async (id: string | number, data?: PaymentData) => {
      try {
        setLoading(true);
        // Если данные переданы, обновляем их, иначе просто платим
        const payload = data
          ? {
              email: data.email,
              fio: data.fio,
              phone_number: data.phone_number,
              address: data.delivery_address,
            }
          : {};

        const response = await api.post(`/order/${id}`, payload);

        if (response.data.status === "success" && response.data.data.url) {
          window.location.href = response.data.data.url;
        } else {
          toast.error("Не удалось получить ссылку на оплату");
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "Ошибка оплаты";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 5. Изменение статуса заказа (Админ)
  const changeStatus = useCallback(
    async (orderId: string | number, status: string) => {
      try {
        // Поддержка обоих вариантов эндпоинтов (RESTful и через body)
        // Если ваш бэк использует PUT /order/status:
        await api.put(`/order/status`, { order_id: orderId, status });

        // Или если PUT /order/:id:
        // await api.put(`/order/${orderId}`, { status });

        toast.success("Статус заказа обновлен");

        // Обновляем локальное состояние, чтобы не делать лишний запрос
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
        );
        return true;
      } catch (err: any) {
        console.error("Error changing status:", err);
        toast.error(err.response?.data?.message || "Ошибка изменения статуса");
        return false;
      }
    },
    [],
  );

  return {
    orders,
    userOrders,
    loading,
    error,
    fetchOrders,
    fetchUserOrders,
    payOrder,
    payOrderById,
    changeStatus,
  };
};
