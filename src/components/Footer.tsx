import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-teal-900 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Link to="/" className="flex space-x-2">
            <div
              className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)",
              }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">SdMedik</h3>
              <p className="text-xs text-white w-50">
                Медтехника по социальному сертификату
              </p>
            </div>
          </Link>
          <div>
            <h3 className="font-semibold mb-4 text-white">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/catalog"
                  className="text-sm text-white hover:text-teal-500 transition-colors"
                >
                  Каталог
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-white hover:text-teal-500  transition-colors"
                >
                  О компании
                </Link>
              </li>
              <li>
                <Link
                  to="/contacts"
                  className="text-sm text-white hover:text-teal-500  transition-colors"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/delivery"
                  className="text-sm text-white hover:text-teal-500  transition-colors"
                >
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-sm text-white hover:text-teal-500  transition-colors"
                >
                  Возврат и гарантия
                </Link>
              </li>
              <li>
                <Link
                  to="/certificates"
                  className="text-sm text-white hover:text-teal-500  transition-colors"
                >
                  Сертификаты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-white">
                <Phone className="h-4 w-4 mr-2 text-white" />
                +7 (903) 086-30-91
              </li>
              <li className="flex items-center text-sm text-white">
                <Phone className="h-4 w-4 mr-2 text-white" />
                +7 (353) 293-52-41
              </li>
              <li className="flex items-center text-sm text-white">
                <Mail className="h-4 w-4 mr-2 text-white" />
                info@SdMedik.ru
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-white">
          <p>© 2025 SdMedik. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
