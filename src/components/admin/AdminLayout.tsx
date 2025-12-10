import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export default function AdminLayout() {
  const { isAdmin, loading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем актуальность сессии при загрузке админки
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/30">
      {/* Сайдбар для десктопа */}
      <div className="hidden md:block w-64 fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>

      {/* Основной контент */}
      <div className="flex flex-col w-full md:pl-64 transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
