import { Link } from "react-router-dom";

const HeaderNav = ({ navigation }: { navigation: { name: string; href: string }[] }) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNav;
