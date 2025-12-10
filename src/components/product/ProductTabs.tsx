import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/interface/product";
import { FileText, ListFilter, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductTabs({ product }: { product: Product }) {
  // Фильтруем характеристики сразу, чтобы не засорять JSX
  const characteristics = product.characteristic.filter(
    (c) => !["размер", "цвет", "рост"].includes(c.name.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <Tabs defaultValue="desc" className="w-full">
        {/* Стильный переключатель "Капсула" */}
        <TabsList className="w-full sm:w-auto inline-flex h-auto p-1 bg-slate-100/80 rounded-xl mb-6">
          <TabsTrigger
            value="desc"
            className="flex-1 sm:flex-none gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg text-slate-500 transition-all
            data-[state=active]:bg-white data-[state=active]:text-[#00B3A4] data-[state=active]:shadow-sm hover:text-slate-700"
          >
            <FileText className="w-4 h-4" />
            Описание
          </TabsTrigger>
          <TabsTrigger
            value="chars"
            className="flex-1 sm:flex-none gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg text-slate-500 transition-all
            data-[state=active]:bg-white data-[state=active]:text-[#00B3A4] data-[state=active]:shadow-sm hover:text-slate-700"
          >
            <ListFilter className="w-4 h-4" />
            Характеристики
          </TabsTrigger>
        </TabsList>

        {/* Контент Описания */}
        <TabsContent
          value="desc"
          className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {product.description ? (
            <div className="prose prose-slate prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
              <p>Описание отсутствует</p>
            </div>
          )}
        </TabsContent>

        {/* Контент Характеристик */}
        <TabsContent
          value="chars"
          className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {characteristics.length > 0 ? (
            <div className="rounded-xl overflow-hidden border border-slate-100">
              {characteristics.map((char, index) => (
                <div
                  key={char.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:justify-between py-4 px-5 transition-colors hover:bg-teal-50/30",
                    index % 2 === 0 ? "bg-slate-50/50" : "bg-white",
                  )}
                >
                  <span className="text-slate-500 text-sm font-medium mb-1 sm:mb-0">
                    {char.name}
                  </span>

                  {/* Отрисовка линии-заполнителя (точки) только на десктопе для красоты, если нужно */}
                  {/* <div className="hidden sm:block flex-1 mx-4 border-b border-dotted border-slate-300 relative top-[-6px]" /> */}

                  <span className="text-slate-900 text-sm font-semibold sm:text-right">
                    {Array.isArray(char.value)
                      ? char.value.join(", ")
                      : String(char.value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <ListFilter className="w-10 h-10 mb-2 opacity-50" />
              <p>Характеристики не указаны</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
