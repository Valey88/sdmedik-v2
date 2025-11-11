import HeaderLogo from "./HeaderLogo";
import HeaderNav from "./HeaderNav";
import HeaderActions from "./HeaderActions";
import { useState } from "react";
import HeaderSearchCatalog from "./HeaderSearchCatalog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Сертификат", href: "/certificate" },
    { name: "Блог", href: "/blog" },
    { name: "Доставка", href: "/delivery" },
    { name: "Возврат", href: "/returnpolicy" },
    { name: "О компании", href: "/about" },
    { name: "Контакты", href: "/contacts" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-xl bg-white/60 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex-col space-y-2 items-center justify-between">
        {/* навигация сверху */}
        <div className="flex justify-center">
          <HeaderNav navigation={navigation} />
        </div>

        {/* основная строка — логотип + поиск/каталог (десктоп) + действия */}
        <div className="flex justify-between w-full items-center gap-4">
          <HeaderLogo />

          {/* Десктоп — поиск между Logo и Actions */}
          <div className="hidden md:block flex-1">
            <HeaderSearchCatalog />
          </div>

          <HeaderActions
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            navigation={navigation}
          />
        </div>

        {/* Mobile — вынесенный блок поиска/каталога */}
        <div className="block md:hidden w-full">
          <HeaderSearchCatalog />
        </div>
      </div>
    </header>
  );
};

export default Header;
