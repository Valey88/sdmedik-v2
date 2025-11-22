// hooks/useProducts.ts
import { useState, useCallback } from 'react';
import api from '@/config/Config'; // Твой axios instance
import { Product, ProductResponse, FetchProductsParams } from '@/interface/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (params: FetchProductsParams) => {
    try {
      setLoading(true);
      setError(null);

      // Запрос к API
      const response = await api.get<ProductResponse>('/product', {
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

      if (response.data.status === 'success') {
        // Проверка: сервер может вернуть массив или объект, приводим к массиву
        const productsData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];

        setProducts(productsData);
        setTotalCount(response.data.count || 0);
      } else {
        setError('Не удалось загрузить список товаров');
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || 'Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    products, 
    totalCount, 
    loading, 
    error, 
    fetchProducts 
  };
};