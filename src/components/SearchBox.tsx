import React, { useState, useEffect, useRef,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import {
  Search,
  Loader2,
  X,
  ShoppingCart,
} from "lucide-react";
import api from "@/config/Config"; // Твой настроенный инстанс axios
import { cn } from "@/lib/utils"; // Стандартная утилита shadcn/tailwind

// --- Типы данных ---
interface Product {
  id: number;
  name: string;
  price: number;
  slug?: string; // или id для ссылки
  image?: string;
}

// --- Хук для Debounce (оптимизация запросов) ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// --- Компонент одного умного инпута поиска ---
export const SearchBox = ({
  className,
  autoFocus = false,
}: {
  className?: string;
  autoFocus?: boolean;
}) => {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Используем дебаунс, чтобы не спамить сервер
  const debouncedQuery = useDebounce(query, 300);

  // Обработка клика вне компонента для закрытия
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Эффект поиска
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/search`, {
          params: { query: debouncedQuery },
        });
        // Предполагаем, что данные приходят в response.data (или response.data.data)
        // Адаптируй под структуру ответа твоего бэкенда
        setResults(
          Array.isArray(response.data)
            ? response.data
            : response.data.products || []
        );
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  // Очистка поиска
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Переход на товар
  const handleSelectProduct = (product: Product) => {
    setIsOpen(false);
    setQuery(""); // Опционально: очищать или оставлять текст
    navigate(`/product/${product.id}`); // Или product.slug
  };

  // Обработка клавиатуры
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && results[focusedIndex]) {
        handleSelectProduct(results[focusedIndex]);
      } else if (query) {
        // Если нажали Enter без выбора из списка — идем на страницу общей выдачи
        navigate(`/catalog?search=${query}`);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Хелпер для подсветки текста
  const highlightMatch = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <span
          key={index}
          className="bg-yellow-100 text-orange-600 font-medium rounded-sm px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full z-50", className)}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Поиск товаров..."
          className="pr-10 pl-4 py-5 transition-all border-muted-foreground/20 focus:border-primary"
          autoFocus={autoFocus}
        />

        {/* Иконки справа */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X size={18} />
            </button>
          ) : (
            <Search className="text-muted-foreground h-5 w-5 mr-1" />
          )}
        </div>
      </div>

      {/* Выпадающий список результатов */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {results.length > 0 ? (
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {results.map((product, index) => (
                <li key={product.id}>
                  <div
                    onClick={() => handleSelectProduct(product)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors",
                      index === focusedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {/* Миниатюра изображения (заглушка если нет) */}
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                          <ShoppingCart size={16} />
                        </div>
                      )}
                    </div>

                    {/* Текст */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">
                        {highlightMatch(product.name, query)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                        }).format(product.price)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}

              {/* Ссылка "Показать все результаты" */}
              <li className="border-t mt-1">
                <Link
                  to={`/catalog?search=${query}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3 text-sm text-primary font-medium hover:bg-muted/30 transition-colors"
                >
                  Показать все результаты ({results.length})
                </Link>
              </li>
            </ul>
          ) : (
            !isLoading && (
              <div className="p-6 text-center text-muted-foreground">
                <p className="text-sm">
                  По запросу "{query}" ничего не найдено
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
