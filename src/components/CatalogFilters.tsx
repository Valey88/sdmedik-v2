import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCategoryFilters } from "@/hooks/useCategoryFilters";

interface FiltersProps {
  categoryId: number | string;
  onApply: (filters: any) => void;
  isLoading?: boolean;
}

export const CatalogFilters = ({
  categoryId,
  onApply,
  isLoading,
}: FiltersProps) => {
  const {
    fetchFilters,
    filtersData,
    loading: filtersLoading,
  } = useCategoryFilters();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedValues, setSelectedValues] = useState<Record<number, any[]>>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);

  // ДОБАВЛЕНО: Стейт для управления открытыми вкладками аккордеона
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  useEffect(() => {
    if (categoryId) {
      fetchFilters(categoryId);
    }
  }, [categoryId, fetchFilters]);

  // ОПЦИОНАЛЬНО: Если вы хотите, чтобы при загрузке фильтров они все сразу раскрывались
  // раскомментируйте этот useEffect:
  /*
  useEffect(() => {
    if (filtersData && filtersData.length > 0) {
      const allItems = filtersData.map(char => `item-${char.id}`);
      setOpenAccordionItems(allItems);
    }
  }, [filtersData]);
  */

  const handleCheckboxChange = (charId: number, value: any) => {
    setSelectedValues((prev) => {
      const current = prev[charId] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [charId]: exists
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleApply = () => {
    const filterData = {
      price: {
        min: minPrice ? Number(minPrice) : 0,
        max: maxPrice ? Number(maxPrice) : 0,
      },
      characteristics: Object.entries(selectedValues)
        .filter(([_, values]) => values.length > 0)
        .map(([id, values]) => ({
          characteristic_id: Number(id),
          values: values.map(String),
        })),
    };

    onApply(filterData);
    setIsOpen(false);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedValues({});
    onApply(null);
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Цена */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium leading-none">Цена, ₽</h4>
        <div className="flex gap-2">
          <Input
            placeholder="От"
            type="text" // Лучше использовать type="number" для цен
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9"
          />
          <Input
            placeholder="До"
            type="text" // Лучше использовать type="number" для цен
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      {/* Характеристики (Аккордеон) */}
      {filtersLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <Accordion
          type="multiple"
          className="w-full"
          // ИСПРАВЛЕНИЕ: Делаем компонент контролируемым
          value={openAccordionItems}
          onValueChange={setOpenAccordionItems}
        >
          {(filtersData || []).map((char) => (
            <AccordionItem
              value={`item-${char.id}`} // Значение совпадает с тем, что попадает в массив openAccordionItems
              key={char.id}
              className="border-b-slate-100"
            >
              <AccordionTrigger className="text-sm hover:text-[#00B3A4] hover:no-underline py-3">
                {char.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {char.values?.map((val) => (
                    <div
                      key={`${char.id}-${val}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`chk-${char.id}-${val}`}
                        checked={
                          selectedValues[char.id]?.includes(val) || false
                        }
                        onCheckedChange={() =>
                          handleCheckboxChange(char.id, val)
                        }
                        className="data-[state=checked]:bg-[#00B3A4] data-[state=checked]:border-[#00B3A4]"
                      />
                      <label
                        htmlFor={`chk-${char.id}-${val}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {typeof val === "boolean" ? (val ? "Да" : "Нет") : val}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {(!filtersData || filtersData.length === 0) && (
            <div className="text-sm text-slate-400 py-2">
              Нет доступных фильтров
            </div>
          )}
        </Accordion>
      )}

      {/* Кнопки */}
      <div className="flex flex-col gap-2 pt-4">
        <Button
          onClick={handleApply}
          disabled={isLoading || filtersLoading}
          className="w-full bg-[#00B3A4] hover:bg-[#009b8e]"
        >
          Применить
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading || filtersLoading}
          className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Сбросить
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 p-5 shadow-sm sticky top-24">
        <div className="flex items-center gap-2 mb-6 text-[#00B3A4]">
          <Filter size={20} />
          <span className="font-bold text-lg">Фильтры</span>
        </div>
        <FilterContent />
      </div>

      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-[#00B3A4] text-[#00B3A4]"
            >
              <Filter size={16} /> Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] overflow-y-auto"
          >
            <SheetHeader className="mb-6 text-left">
              <SheetTitle>Фильтры товаров</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
