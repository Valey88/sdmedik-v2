import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CatalogPagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPageButton = (page: number) => {
    const isActive = page === currentPage;
    return (
      <Button
        key={page}
        variant={isActive ? "default" : "outline"}
        size="icon"
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 transition-all ${
           isActive 
             ? 'bg-[#00B3A4] hover:bg-[#009b8e] text-white border-transparent' 
             : 'hover:bg-teal-50 hover:text-[#00B3A4] border-slate-200'
        }`}
      >
        {page}
      </Button>
    );
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-10 w-10 border-slate-200"
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Простая логика отображения, можно расширить */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
         .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
         .map((page, index, array) => (
           <React.Fragment key={page}>
             {index > 0 && array[index - 1] !== page - 1 && (
               <div className="text-slate-400 px-1"><MoreHorizontal size={16}/></div>
             )}
             {renderPageButton(page)}
           </React.Fragment>
         ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-10 w-10 border-slate-200"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};