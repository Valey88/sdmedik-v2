import { useState, useCallback } from "react";
import api from "@/config/Config";
import { toast } from "react-toastify";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const deleteProduct = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      await api.delete(`/product/${id}`);
      toast.success("Товар успешно удален");
      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Ошибка удаления товара");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Продукт успешно создан");
      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Ошибка создания: " + (error.response?.data?.message || error.message)
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      await api.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Продукт успешно обновлен");
      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Ошибка обновления: " + (error.response?.data?.message || error.message)
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Остальные методы (deleteCategory, etc.)
  const deleteCategory = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      await api.delete(`/category/${id}`);
      toast.success("Категория успешно удалена");
      return true;
    } catch (error: any) {
      toast.error("Ошибка удаления категории");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    deleteProduct,
    createProduct,
    updateProduct,
    deleteCategory,
  };
};
