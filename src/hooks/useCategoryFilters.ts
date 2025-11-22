import { useState, useCallback } from "react";
import api from "@/config/Config";

interface Characteristic {
  id: number;
  name: string;
  values: (string | number | boolean)[];
}

interface FilterResponse {
  data: {
    // Указываем оба варианта написания, так как API бывают непредсказуемы
    characteristics?: Characteristic[];
    characteristic?: Characteristic[];
  };
  status: string;
}

export const useCategoryFilters = () => {
  // Важно: Инициализируем пустым массивом [], чтобы map не ломался при первом рендере
  const [filtersData, setFiltersData] = useState<Characteristic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = useCallback(async (categoryId: string | number) => {
    try {
      setLoading(true);
      setError(null);

      // Используем правильный эндпоинт.
      // Если у тебя фильтры приходят вместе с категорией: /category/${id}
      // Если отдельный роут фильтров: /filters?category_id=${id}

      // ПРОВЕРЬ ЭТОТ URL в соответствии с твоим API
      const response = await api.get<FilterResponse>(
        `/product/filter/${categoryId}`
      );
      // const response = await api.get<FilterResponse>(`/filters`, { params: { category_id: categoryId } });

      if (response.data.status === "success") {
        // Проверяем все возможные поля, где может лежать массив
        const data = response.data.data;
        const chars = data.characteristics || data.characteristic || [];

        // Гарантируем, что это массив
        setFiltersData(Array.isArray(chars) ? chars : []);
      }
    } catch (err: any) {
      console.error("Error fetching filters:", err);
      setError("Не удалось загрузить фильтры");
      setFiltersData([]); // При ошибке сбрасываем в пустой массив
    } finally {
      setLoading(false);
    }
  }, []);

  return { filtersData, loading, error, fetchFilters };
};
