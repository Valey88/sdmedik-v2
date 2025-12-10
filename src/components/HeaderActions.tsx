import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import UserAuthSheet from "./UserAuthSheet";
import { useEffect } from "react";
import { useBasket } from "@/store/useBasket";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  navigation: { name: string; href: string }[];
}

const HeaderActions = ({ isMenuOpen, setIsMenuOpen, navigation }: Props) => {
  const { basket, fetchUserBasket } = useBasket();

  useEffect(() => {
    fetchUserBasket();
  }, []);

  // Получаем количество товаров (с защитой от null/undefined)
  const quantity = basket?.quantity || 0;

  return (
    <div className="flex items-center space-x-2">
      {/* Личный кабинет */}
      <UserAuthSheet>
        <button className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors">
          <User size={24} />
        </button>
      </UserAuthSheet>

      {/* Корзина с баджем */}
      <Link
        to="/cart"
        className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors group"
      >
        <ShoppingCart size={24} />

        {/* Бадж количества */}
        {quantity > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#00B3A4] text-white text-[10px] font-bold px-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
            {quantity > 99 ? "99+" : quantity}
          </span>
        )}
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
        <nav className="absolute top-full right-0 mt-4 w-56 bg-white border border-teal-200 rounded-xl shadow-lg md:hidden z-50">
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
