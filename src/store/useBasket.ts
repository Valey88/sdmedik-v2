import { create } from "zustand";
import { toast } from "react-toastify";
import api from "@/config/Config";
import {
  BasketData,
  BasketResponse,
  AddToBasketParams,
} from "@/interface/basket";

interface BasketStore {
  basket: BasketData;
  loading: boolean;
  error: string | null;

  // Методы
  fetchUserBasket: () => Promise<void>;
  addToBasket: (params: AddToBasketParams) => Promise<boolean>;
  updateQuantity: (
    productId: string,
    quantityDelta: number,
    iso?: string,
  ) => Promise<void>;
  removeFromBasket: (id: string) => Promise<void>;
}

export const useBasket = create<BasketStore>((set, get) => ({
  // Начальное состояние
  basket: {
    items: [],
    quantity: 0,
    total_price: 0,
  },
  loading: false,
  error: null,

  // --- Получить корзину ---
  fetchUserBasket: async () => {
    try {
      set({ loading: true });
      const response = await api.get<BasketResponse>("/basket");

      if (response.data.status === "success") {
        set({ basket: response.data.data });
      }
    } catch (err: any) {
      console.error("Error fetching basket:", err);
      // Не блокируем UI ошибкой при первой загрузке
    } finally {
      set({ loading: false });
    }
  },

  // --- Добавить товар ---
  addToBasket: async (params) => {
    try {
      set({ loading: true });
      await api.post("/basket", {
        product_id: params.product_id,
        quantity: params.quantity,
        iso: params.iso,
        dynamic_options: params.dynamic_options,
      });

      toast.success("Продукт добавлен в корзину");

      // Обновляем глобальное состояние сразу после добавления
      await get().fetchUserBasket();
      return true;
    } catch (err: any) {
      console.error("Error adding to basket:", err);
      const message =
        err.response?.data?.message || "Ошибка при добавлении в корзину";
      toast.error(message);
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // --- Изменить количество ---
  updateQuantity: async (productId, quantityDelta, iso) => {
    try {
      // Оптимистичное обновление (сразу меняем цифру в интерфейсе для скорости)
      // Но основной пересчет делает fetchUserBasket
      await api.post("/basket", {
        product_id: productId,
        quantity: quantityDelta,
        iso: iso,
      });

      // Обновляем глобальное состояние
      await get().fetchUserBasket();
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      toast.error("Не удалось изменить количество");
    }
  },

  // --- Удалить товар ---
  removeFromBasket: async (id) => {
    try {
      set({ loading: true });
      await api.delete(`/basket/${id}`);

      toast.success("Продукт удален из корзины");

      // Мгновенно убираем из списка локально (оптимистично)
      const currentBasket = get().basket;
      set({
        basket: {
          ...currentBasket,
          items: currentBasket.items.filter((item) => item.id !== id),
        },
      });

      // Актуализируем данные (цену и кол-во) с сервера
      await get().fetchUserBasket();
    } catch (err: any) {
      console.error("Error removing item:", err);
      toast.error("Ошибка при удалении товара");
    } finally {
      set({ loading: false });
    }
  },
}));
