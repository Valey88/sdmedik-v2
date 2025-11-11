import {
  Wrench,
  Truck,
  GraduationCap,
  Phone,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function Services() {
  const secondaryGradient =
    "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)";

  const services = [
    {
      icon: Wrench,
      title: "Техническое обслуживание",
      description:
        "Профессиональное обслуживание и ремонт медицинского оборудования",
      features: [
        "Плановое ТО",
        "Аварийный ремонт",
        "Замена комплектующих",
        "Гарантийное обслуживание",
      ],
    },
    {
      icon: Truck,
      title: "Доставка и установка",
      description: "Быстрая доставка и профессиональная установка оборудования",
      features: [
        "Доставка по России",
        "Монтаж и настройка",
        "Пусконаладочные работы",
        "Обучение персонала",
      ],
    },
    {
      icon: GraduationCap,
      title: "Обучение персонала",
      description: "Комплексное обучение работе с медицинским оборудованием",
      features: [
        "Теоретический курс",
        "Практические занятия",
        "Сертификация",
        "Повышение квалификации",
      ],
    },
    {
      icon: Phone,
      title: "Техническая поддержка",
      description: "Круглосуточная техническая поддержка и консультации",
      features: [
        "Поддержка 24/7",
        "Удаленная диагностика",
        "Консультации экспертов",
        "Горячая линия",
      ],
    },
  ];

  return (
    <section className="py-20 bg-teal-50/50">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <p
            className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3"
            style={{ background: secondaryGradient, color: "white" }}
          >
            Наши услуги
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Мы заботимся о вашем оборудовании
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Полный спектр услуг для обеспечения эффективной работы вашего
            медицинского оборудования
          </p>
        </div>

        {/* Карточки услуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-teal-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${secondaryGradient}`, color: "white" }}
                >
                  <service.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-[#00B3A4]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Процесс работы */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-teal-200 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Как мы работаем
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Консультация",
                desc: "Обсуждаем ваши потребности",
              },
              {
                step: "02",
                title: "Подбор",
                desc: "Выбираем оптимальное решение",
              },
              {
                step: "03",
                title: "Поставка",
                desc: "Доставляем и устанавливаем",
              },
              { step: "04", title: "Поддержка", desc: "Обеспечиваем сервис" },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                  style={{ background: secondaryGradient }}
                >
                  {item.step}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-[#00B3A4]/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA блок */}
        <div className="text-center mt-16">
          <div
            className="rounded-2xl p-8 md:p-12 text-white shadow-lg"
            style={{ background: secondaryGradient }}
          >
            <Clock className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Нужна помощь с оборудованием?
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Наши специалисты готовы помочь вам 24/7. Получите бесплатную
              консультацию и индивидуальное предложение уже сегодня.
            </p>
            
          </div>
        </div>
      </div>
    </section>
  );
}
