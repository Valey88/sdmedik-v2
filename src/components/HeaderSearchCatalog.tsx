import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, ChevronDown, } from "lucide-react";
import { SearchBox } from "./SearchBox";

const HeaderSearchCatalog = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 mt-2">
      {/* === MOBILE VERSION === */}
      {/* Кнопка каталога */}
      <Link to="/catalog" className="w-full md:hidden">
        <Button
          variant="default"
          className="w-full flex justify-center gap-2 font-semibold"
        >
          <Menu size={18} />
          Каталог
          <ChevronDown size={16} />
        </Button>
      </Link>

      {/* Поиск (Мобильный) */}
      <div className="flex md:hidden w-full">
        <SearchBox />
      </div>

      {/* === DESKTOP VERSION === */}
      <div className="hidden md:flex items-center justify-center gap-4 w-full">
        <Link to="/catalog" className="hidden lg:block flex-shrink-0">
          <Button variant="default" className="gap-2 px-6 font-semibold">
            <Menu size={18} />
            Каталог
            <ChevronDown size={16} />
          </Button>
        </Link>

        {/* Поиск (Десктоп) */}
        <div className="hidden md:flex flex-1 max-w-2xl">
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default HeaderSearchCatalog;
