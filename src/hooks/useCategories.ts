// hooks/useCategories.ts
import { useState, useEffect } from "react";
import api from "@/config/Config";
import { Category, CategoryResponse } from "@/interface/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Используем тип CategoryResponse для типизации ответа
      const response = await api.get<CategoryResponse>(`/category`);

      if (response.data.status === "success") {
        setCategories(response.data.data);
      } else {
        setError("Не удалось загрузить данные");
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryId = async (id: number) => {
    try {
      setLoading(true);
      // Используем тип CategoryResponse для типизации ответа
      const response = await api.get<CategoryResponse>(`/category/${id}`);

      if (response.data.status === "success") {
        setCategories(response.data.data);
      } else {
        setError("Не удалось загрузить данные");
      }
    } catch (err) {
      console.error("Error fetching category:", err);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    fetchCategoryId,
  };
};
