import { useState, useCallback } from "react";
import api from "@/config/Config";
import {
  Product,
  ProductResponse,
  FetchProductsParams,
} from "@/interface/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Получение списка товаров ---
  const fetchProducts = useCallback(async (params: FetchProductsParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ProductResponse>("/product", {
        params: {
          category_id: params.category_id,
          filters: params.filters,
          offset: params.offset,
          limit: params.limit,
          catalogs: params.catalogs,
          name: params.searchTerm,
          article: params.searchArticle,
        },
      });

      if (response.data.status === "success") {
        const rawData = response.data.data;
        // Гарантируем, что это массив для списка
        const productsData = Array.isArray(rawData) ? rawData : [rawData];

        setProducts(productsData);
        setTotalCount(response.data.count || 0);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("Не удалось загрузить список товаров");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Получение одного товара ---
  const fetchProductById = useCallback(async (id: string,iso?:string) => {
    try {
      setLoading(true);
      setError(null);

      // Используем params: { id: id }, как на бэкенде
      const response = await api.get<ProductResponse>("/product", {
        params: { id,iso },
      });

      if (response.data.status === "success") {
        const rawData = response.data.data;

        // Сервер вернул ОДИН объект в data (судя по твоему JSON)
        // Но на всякий случай проверяем, не массив ли это
        const productData = Array.isArray(rawData) ? rawData[0] : rawData;

        if (productData) {
          setCurrentProduct(productData);
          return productData;
        } else {
          setError("Товар не найден");
        }
      }
    } catch (err: any) {
      console.error("Error fetching product:", err);
      setError(err.response?.data?.message || "Ошибка загрузки товара");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    currentProduct,
    totalCount,
    loading,
    error,
    fetchProducts,
    fetchProductById,
  };
};
