import { useState, useCallback } from "react";
import api from "@/config/Config";

export interface User {
  id: string | number;
  email: string;
  fio: string;
  phone_number: string;
  role: string;
  created_at?: string;
}

interface UsersResponse {
  data: {
      users: User[];
      count: number;
      allUsers?: User[]; // Для совместимости со старым кодом, если он возвращает такую структуру
  };
  status: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<UsersResponse>("/user"); // Проверь правильный URL админского эндпоинта
      
      if (response.data?.data) {
          // Если сервер возвращает { data: { users: [], count: 0 } }
          const userData = response.data.data;
          setUsers(userData.users || userData.allUsers || []);
          setTotalCount(userData.count || (userData.users || []).length);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, totalCount, loading, fetchUsers };
};