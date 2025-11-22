// interface/product.ts

export interface ProductImage {
  id: string;
  name: string; // путь к файлу, например "image.jpg"
  // добавь другие поля, если есть (is_main, sort_order и т.д.)
}

export interface Product {
  id: string;
  article: string;
  name: string;
  price: number;
  old_price?: number | null; // на случай скидок
  preview?: string; // Текст бейджа (например "Хит")
  nameplate?: string; // Текст бейджа (например "Новинка")
  catalogs?: number; // 1 - обычный, 2 - сертификат и т.д.
  images: ProductImage[];
  description?: string;
}

export interface ProductResponse {
  count: number;
  data: Product[];
  status: string;
}

// Параметры для запроса
export interface FetchProductsParams {
  category_id?: string;
  filters?: string | null; // JSON string
  offset: number;
  limit: number;
  catalogs: string; // "1,2"
  searchTerm?: string;
  searchArticle?: string;
}
