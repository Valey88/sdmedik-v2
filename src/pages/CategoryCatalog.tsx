import { ArrowRight, Activity, Package } from "lucide-react";
import { useCategories } from "../hooks/useCategories"; // Импорт нашего хука
// import { Category } from "@/interface/category";
import { urlPictures } from "@/config/Config";
import { Link } from "react-router-dom";

export default function CategoryCatalog() {
  const { categories, loading, error } = useCategories();

  // Твой фирменный градиент
  const secondaryGradient =
    "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)";

  // Функция для получения картинки или заглушки
  // const getCategoryImage = (category: Category) => {
  //   if (
  //     category.images &&
  //     category.images.length > 0 &&
  //     category.images[0].url
  //   ) {
  //     return category.images[0].url;
  //   }
  //   // Заглушка, если картинки нет (можно заменить на свой плейсхолдер)
  //   return "/placeholder-medical.png";
  // };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-teal-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B3A4]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 bg-teal-50/50">
        {error}
      </div>
    );
  }

  return (
    <section className="py-20 bg-teal-50/50">
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <div className="text-center mb-16 animate-fade-in">
          <p
            className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 shadow-sm"
            style={{ background: secondaryGradient, color: "white" }}
          >
            Каталог продукции
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Выберите категорию
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Широкий ассортимент медицинского оборудования и средств реабилитации
            для профессионального и домашнего использования.
          </p>
        </div>

        {/* Сетка категорий */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={`/products/${category.id}`}>
              <div
                key={category.id}
                className="group bg-white rounded-2xl p-5 border border-teal-100 hover:border-[#00B3A4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden"
              >
                {/* Декоративный фон при наведении */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Область изображения */}
                <div className="relative h-48 mb-6 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  {category.images && category.images.length > 0 ? (
                    <img
                      src={`${urlPictures}/${category.images[0].name}`}
                      alt={category.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    // Если нет картинки, показываем иконку
                    <Activity className="w-12 h-12 text-teal-300/50" />
                  )}

                  {/* Бейдж количества товаров (если products не null, можно вывести длину) */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-500 border border-teal-100 flex items-center gap-1">
                    <Package size={12} />
                    <span>{category.name}</span>
                  </div>
                </div>

                {/* Информация */}
                <div className="flex-1 flex flex-col z-10">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00B3A4] transition-colors mb-2 line-clamp-2">
                    {category.name}
                  </h3>

                  {/* Характеристики (опционально, выводим первые 2 как теги) */}
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {category.characteristic?.slice(0, 2).map((char) => (
                      <span
                        key={char.id}
                        className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-md"
                      >
                        {char.name}
                      </span>
                    ))}
                  </div>

                  {/* Кнопка перехода */}
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-[#00B3A4] transition-colors">
                      Перейти в каталог
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#00B3A4] group-hover:text-white text-teal-500 bg-teal-50">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
