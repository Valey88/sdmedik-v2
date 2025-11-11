import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Menu, ChevronDown, Search } from "lucide-react";

const HeaderSearchCatalog = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 mt-2">

      {/* Catalog button — mobile версия */}
      <Link to="/catalog" className="w-full md:hidden">
        <Button
          variant="default"
          className="w-full flex justify-center gap-2"
        >
          <Menu size={18} />
          Каталог
          <ChevronDown size={16} />
        </Button>
      </Link>

      {/* Search — mobile версия */}
      <div className="flex md:hidden w-full relative">
        <Input
          type="text"
          placeholder="Поиск товаров..."
          className="w-full p-4"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full"
        >
          <Search size={20} />
        </Button>
      </div>

      {/* Desktop — остаётся прежним */}
      <div className="hidden md:flex items-center justify-center gap-4 w-full">

        <Link to="/catalog" className="hidden lg:block">
          <Button variant="default" className="gap-2">
            <Menu size={18} />
            Каталог
            <ChevronDown size={16} />
          </Button>
        </Link>

        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <Input
            type="text"
            placeholder="Поиск товаров..."
            className="p-5"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full"
          >
            <Search size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearchCatalog;
