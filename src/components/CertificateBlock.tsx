import { ArrowRight, Clock, Shield, Truck } from "lucide-react";

export default function CertificateBlock() {
  const secondaryGradient =
    "linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)";

  return (
    <section className="bg-teal-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - text */}
          <div className="space-y-6">
            <p
              className="inline-block px-3 py-1 text-sm font-medium rounded-full"
              style={{ background: secondaryGradient, color: "white" }}
            >
              Помощь по соц. сертификату
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Медтехника по социальному сертификату
            </h1>

            <p className="text-base text-gray-600 max-w-xl">
              Получите необходимое оборудование бесплатно или с большой скидкой.
              Помогаем оформить документы и реализовать вашу поддержку от
              государства.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                className="text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                style={{
                  background: secondaryGradient,
                }}
                aria-label="Каталог"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/catalog";
                }}
              >
                <span className="font-semibold">Смотреть каталог</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                className="border-2 px-8 py-4 rounded-lg transition-all duration-300"
                style={{
                  borderColor: "#00B3A4",
                  color: "#00B3A4",
                  background: "transparent",
                }}
                aria-label="Бесплатная консультация"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/certificate";
                }}
              >
                <span className="font-semibold">Подробнее о сертификате</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-12 bg-teal-600/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#00B3A4]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Гарантия качества
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Сертифицированное оборудование
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-600/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#00B3A4]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Быстрая доставка
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    По всей России
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-600/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#00B3A4]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Поддержка 24/7
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Техническая помощь
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - image */}
          <div className="relative flex items-center justify-center">
            <div
              className="w-full max-w-xl rounded-2xl overflow-hidden shadow-lg"
              role="img"
              aria-label="Клиент и консультант в шоу-руме"
            >
              {/* Replace the src with the generated image path */}
              <img
                src="/certificatePreview.png"
                alt="Довольная женщина в инвалидном кресле и консультант показывают сертификат на планшете в современном шоу-руме"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Decorative gradient accent (subtle)
            <svg
              className="pointer-events-none absolute -bottom-6 -right-6 w-48 h-48 opacity-60 -z-10"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <linearGradient id="gradAccent" x1="0" x2="1">
                  <stop offset="0%" stopColor="#00B3A4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#66D1C6" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#gradAccent)" />
            </svg> */}
          </div>
        </div>
      </div>
    </section>
  );
}
