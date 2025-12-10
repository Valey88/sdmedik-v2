import { useState, useCallback, useEffect } from "react";
import api from "@/config/Config";
import { Category, CategoryResponse } from "@/interface/category";
import { toast } from "react-toastify";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Получение всех категорий
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<CategoryResponse>("/category");

      if (response.data.status === "success") {
        setCategories(response.data.data);
      } else {
        setError("Не удалось загрузить список категорий");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Получение одной категории по ID
  const fetchCategoryId = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      const response = await api.get<CategoryResponse>(`/category/${id}`);

      if (response.data.status === "success") {
        // API возвращает массив или объект? Предположим массив из 1 элемента
        const data = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
        setCurrentCategory(data);
        return data;
      } else {
        setError("Категория не найдена");
      }
    } catch (err) {
      console.error(`Error fetching category ${id}:`, err);
      setError("Ошибка загрузки категории");
    } finally {
      setLoading(false);
    }
  }, []);

  // Создание категории (с картинкой)
  const createCategory = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      await api.post("/category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Категория успешно создана");
      return true;
    } catch (err: any) {
      toast.error(
        "Ошибка создания: " + (err.response?.data?.message || err.message),
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление категории
  const updateCategory = useCallback(async (id: string | number, data: any) => {
    try {
      setLoading(true);
      // Бэкенд ждет JSON для обновления, судя по старому коду
      await api.put(`/category/${id}`, data);
      toast.success("Категория успешно обновлена");
      return true;
    } catch (err: any) {
      toast.error(
        "Ошибка обновления: " + (err.response?.data?.message || err.message),
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    currentCategory,
    loading,
    error,
    refetch: fetchCategories,
    fetchCategoryId,
    createCategory,
    updateCategory,
  };
};
