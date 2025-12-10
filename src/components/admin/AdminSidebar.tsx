import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Tags,
} from "lucide-react";

const sidebarItems = [
  { name: "Обзор", href: "/admin", icon: LayoutDashboard },
  { name: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { name: "Товары", href: "/admin/products", icon: Package },
  { name: "Категории", href: "/admin/categories", icon: Tags },
  { name: "Пользователи", href: "/admin/users", icon: Users },
  { name: "Блог", href: "/admin/blog", icon: FileText },
  { name: "Чат", href: "/admin/chat", icon: MessageSquare },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <div
      className={cn("pb-12 min-h-screen border-r bg-slate-50/50", className)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 px-4">
            <div className="w-8 h-8 bg-[#00B3A4] rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              SdMedik Admin
            </h2>
          </div>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-[#00B3A4]",
                    isActive
                      ? "bg-[#00B3A4]/10 text-[#00B3A4]"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
