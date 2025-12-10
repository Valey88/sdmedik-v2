export interface ProductImage {
  id: string;
  name: string;
}

export interface CategoryInProduct {
  id: number;
  name: string;
}

export interface ProductCharacteristic {
  id: number;
  name: string;
  value: string[] | string | null; // Может быть массивом строк или строкой
  prices?: number[] | null;
  data_type?: string;
}

export interface Product {
  id: string;
  article: string;
  name: string;
  description?: string;
  price: number;
  certificate_price?: number;
  // Важно: сервер отдает массив объектов, а не чисел
  categories: CategoryInProduct[];
  images: ProductImage[];
  characteristic: ProductCharacteristic[];
  catalogs?: number; // 1 или 2
  tru?: string;
  preview?: string;
  nameplate?: string;
}

export interface ProductResponse {
  // data может быть одним продуктом (при getById) или массивом (при getList)
  data: Product | Product[];
  count?: number;
  status: string;
}

export interface FetchProductsParams {
  category_id?: string;
  filters?: string | null;
  offset?: number;
  limit?: number;
  catalogs?: string; // "1,2"
  searchTerm?: string;
  searchArticle?: string;
}
