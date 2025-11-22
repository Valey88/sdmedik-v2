import { ArrowDownUp, CheckCircle2, LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ControlsProps {
  catalogType: string;
  setCatalogType: (val: string) => void;
  sortOrder: string;
  setSortOrder: (val: "default" | "priceAsc" | "priceDesc") => void;
}

export const CatalogControls = ({
  catalogType,
  setCatalogType,
  sortOrder,
  setSortOrder,
}: ControlsProps) => {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-2 z-20 backdrop-blur-md bg-white/95">
      {/* Табы */}
      <div className="bg-slate-100 p-1 rounded-lg flex w-full sm:w-auto">
        <button
          onClick={() => setCatalogType("1,2")}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            catalogType === "1,2"
              ? "bg-white text-[#00B3A4] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <LayoutGrid size={16} />
          <span className="hidden sm:inline">Все товары</span>
          <span className="sm:hidden">Все</span>
        </button>
        <button
          onClick={() => setCatalogType("2")}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            catalogType === "2"
              ? "bg-white text-[#00B3A4] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CheckCircle2 size={16} />
          <span className="hidden sm:inline">Сертификат ФСС</span>
          <span className="sm:hidden">ФСС</span>
        </button>
      </div>

      {/* Сортировка (Select из Shadcn) */}
      <div className="flex items-center gap-3 w-full sm:w-auto min-w-[180px]">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">
          Сортировка:
        </span>
        <Select
          value={sortOrder}
          onValueChange={(val: any) => setSortOrder(val)}
        >
          <SelectTrigger className="w-full h-10 border-slate-200 focus:ring-[#00B3A4]">
            <div className="flex items-center gap-2">
              <ArrowDownUp size={14} className="text-[#00B3A4]" />
              <SelectValue placeholder="По умолчанию" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">По умолчанию</SelectItem>
            <SelectItem value="priceAsc">Сначала дешевые</SelectItem>
            <SelectItem value="priceDesc">Сначала дорогие</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
