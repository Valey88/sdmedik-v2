import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn, ImageOff } from "lucide-react";

interface GalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="aspect-[4/3] bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <ImageOff className="w-12 h-12 mb-2 opacity-50" />
        <span className="text-sm">Нет фото</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Вертикальные миниатюры (Десктоп) / Горизонтальные (Мобайл) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] no-scrollbar pb-1 lg:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setActiveIndex(idx)}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all",
              activeIndex === idx
                ? "border-primary ring-2 ring-primary/20 ring-offset-1"
                : "border-transparent hover:border-slate-200 bg-slate-50",
            )}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-contain p-1 mix-blend-multiply"
            />
          </button>
        ))}
      </div>

      {/* Основное фото */}
      <div className="flex-1 relative group">
        <Dialog>
          <DialogTrigger asChild>
            <div className="aspect-[4/3] lg:aspect-square bg-slate-50/50 rounded-2xl overflow-hidden cursor-zoom-in relative">
              <img
                src={images[activeIndex]}
                alt={productName}
                className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] h-[90vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
            <img
              src={images[activeIndex]}
              alt={productName}
              className="max-w-full max-h-full object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
