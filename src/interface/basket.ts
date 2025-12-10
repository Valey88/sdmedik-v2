// src/interface/basket.ts

export interface DynamicOption {
  id: number;
  value: string;
  name?: string; // Опционально, если сервер возвращает имя опции
}

export interface BasketItem {
  id: string; // Уникальный ID записи в корзине
  product_id: string;
  name: string;
  article?: string;
  image?: string; // URL картинки
  brand?: string;
  price: number;
  quantity: number;
  total_price: number;
  iso?: string; // Регион (если применимо)
  selected_options?: DynamicOption[]; // Выбранные характеристики (цвет, размер и т.д.)
}

export interface BasketData {
  items: BasketItem[];
  quantity: number; // Общее кол-во товаров
  total_price: number; // Общая сумма
  total_price_with_promotion?: number; // Сумма со скидкой
}

export interface BasketResponse {
  data: BasketData;
  status: string;
  message?: string;
}

// Параметры для добавления товара
export interface AddToBasketParams {
  product_id: string | number;
  quantity: number;
  iso?: string | null;
  dynamic_options?: { id: number; value: string }[] | null;
}
