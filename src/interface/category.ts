// types/category.ts

export interface CategoryImage {
  id: string;
  product_id: number | null;
  category_id: number;
  // Добавь поля, если они приходят (url, path),
  // пока предполагаем, что есть url или используем заглушку
  url?: string;
  name: string;
}

export interface Characteristic {
  id: number;
  name: string;
  category_id: number;
  data_type: string;
  values: any | null;
}

export interface Category {
  id: number;
  name: string;
  products: any | null; // Можно уточнить тип продукта, если есть данные
  characteristic: Characteristic[];
  images: CategoryImage[];
}

export interface CategoryResponse {
  data: Category[];
  status: string;
}
