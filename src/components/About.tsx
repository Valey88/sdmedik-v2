import { Users, Award, Globe, Zap } from "lucide-react";

export default function About() {
  const secondaryGradient =
    "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)";

  const stats = [
    { icon: Users, number: "10000+", label: "Довольных клиентов" },
    { icon: Award, number: "10", label: "Лет на рынке" },
    { icon: Globe, number: "46+", label: "Городов доставки" },
    { icon: Zap, number: "100000+", label: "Единиц оборудования" },
  ];

  return (
    <section className="py-20 bg-teal-50/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="animate-fade-in space-y-6">
            <p
              className="inline-block px-3 py-1 text-sm font-medium rounded-full"
              style={{ background: secondaryGradient, color: "white" }}
            >
              О компании
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              О компании <span className="text-[#00B3A4]">SdMedik</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Мы являемся ведущим поставщиком медицинского оборудования в
              России. Наша компания специализируется на поставке
              высококачественной медицинской техники от ведущих мировых
              производителей.
            </p>

            <p className="text-gray-600 leading-relaxed">
              За 15 лет работы мы зарекомендовали себя как надежный партнер для
              медицинских учреждений всех уровней — от частных клиник до крупных
              больничных комплексов.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl border border-teal-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Миссия</h3>
                <p className="text-sm text-gray-600">
                  Обеспечение доступности современных медицинских технологий
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-teal-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Видение</h3>
                <p className="text-sm text-gray-600">
                  Стать лидером в области медицинских технологий в России
                </p>
              </div>
            </div>

            <button
              className="text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
              style={{
                background: secondaryGradient,
              }}
            >
              <span className="font-semibold">Узнать больше</span>
            </button>
          </div>

          {/* Right side - Stats */}
          <div className="animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-teal-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Наши достижения
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: secondaryGradient }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-[#00B3A4] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
