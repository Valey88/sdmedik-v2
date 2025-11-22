import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/interface/product";
import { urlPictures } from "@/config/Config";

interface ProductCardProps {
  product: Product;
  //   onAddToCart: (id: string) => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const secondaryGradient =
    "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)";

  const imageUrl = product.images?.[0]?.name
    ? `${urlPictures}/${product.images[0].name}`
    : "/placeholder.png";

  return (
    <div
      onClick={() => navigate(`/product/certificate/${product.id}`)}
      className="group relative flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#00B3A4]/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Бейджи */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.preview && (
          <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-[10px] px-2 py-0.5">
            {product.preview}
          </Badge>
        )}
        {product.nameplate && (
          <Badge className="bg-blue-500 hover:bg-blue-600 border-none text-[10px] px-2 py-0.5">
            {product.nameplate}
          </Badge>
        )}
      </div>

      {/* Изображение */}
      <div className="relative h-[240px] p-6 bg-slate-50 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1 p-5">
        <div className="text-xs text-muted-foreground font-mono mb-2">
          Арт. {product.article}
        </div>

        <h3 className="font-bold text-slate-900 leading-tight mb-3 line-clamp-2 group-hover:text-[#00B3A4] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex flex-col">
            {product.catalogs === 1 ? (
              <>
                {product.old_price && (
                  <span className="text-xs text-muted-foreground line-through decoration-red-400">
                    {product.old_price.toLocaleString()} ₽
                  </span>
                )}
                <span className="text-lg font-bold text-[#00B3A4]">
                  {Number(product.price).toLocaleString()} ₽
                </span>
              </>
            ) : (
              <Badge
                variant="outline"
                className="text-[#00B3A4] border-[#00B3A4] bg-teal-50"
              >
                По сертификату
              </Badge>
            )}
          </div>

          <Button
            size="icon"
            className="rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: secondaryGradient }}
            onClick={(e) => {
              e.stopPropagation();
            //   onAddToCart(product.id);
            }}
          >
            <ShoppingCart className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
