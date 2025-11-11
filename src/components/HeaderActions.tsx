import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import UserAuthSheet from "./UserAuthSheet";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  navigation: { name: string; href: string }[];
}

const HeaderActions = ({ isMenuOpen, setIsMenuOpen, navigation }: Props) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Личный кабинет (вместо ссылки — выезжающее меню авторизации) */}
      <UserAuthSheet>
        <button className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors">
          <User size={24} />
        </button>
      </UserAuthSheet>

      {/* Корзина */}
      <Link
        to="/basket"
        className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors"
      >
        <ShoppingCart size={24} />
      </Link>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <nav className="absolute top-full right-0 mt-4 w-56 bg-white border border-teal-200 rounded-xl shadow-lg md:hidden">
          <div className="flex flex-col space-y-3 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default HeaderActions;
