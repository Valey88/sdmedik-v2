import { Truck, Package, MapPin, Clock } from "lucide-react";

const DeliveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Доставка</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Способы доставки</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• ПЭК</li>
                <li>• СДЭК</li>
                <li>• Курьерская доставка</li>
                <li>• Почта РФ</li>
                <li>• Собственная логистика</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Стоимость доставки</h3>
              <p className="text-muted-foreground leading-relaxed">
                Стоимость доставки зависит от региона получателя. При доставке
                компанией СДЭК на стоимость также влияет общий вес заказа.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              Условия доставки
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  Стоимость заказа включает в себя стоимость заказанных товаров
                  и стоимость почтовой/курьерской доставки до региона получателя
                  – ПРИ ОФОРМЛЕНИИ ПОЛНОГО СЕРТИФИКАТА на выдачу ТСР.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  ПРИ заказе отдельных ТСР – стоимость доставки УТОЧНЯЙТЕ у
                  специалиста в чате!
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  Способы доставки: ПЭК, СДЭК, Курьеры, Почта РФ, собственная
                  логистика и транспорт, другое.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  Стоимость доставки зависит от региона получателя (при доставке
                  компанией СДЭК на стоимость доставки влияет также общий вес
                  заказа).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Сроки доставки</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Сроки доставки зависят от выбранного способа доставки и
                  региона получателя. Точные сроки уточняйте у наших
                  специалистов при оформлении заказа.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:+79030863091"
                    className="text-primary hover:underline font-medium"
                  >
                    +7 (903) 086 3091
                  </a>
                  <a
                    href="tel:+73532935241"
                    className="text-primary hover:underline font-medium"
                  >
                    +7 (353) 293 5241
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryPage;
