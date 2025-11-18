import { Gift, CheckCircle, CreditCard, Mail } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CertificatePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Оплата электронным сертификатом</h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Теперь оплачивать покупки на нашем сайте вы можете и электронным сертификатом
          </p>

          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">Что такое электронный сертификат?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed ml-13">
                    Электронный сертификат — это удобный способ оплаты покупок на нашем сайте. 
                    Сертификат выдается в электронном виде и может быть использован для оплаты 
                    любых товаров из нашего ассортимента.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">Как получить сертификат?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground ml-13">
                    <li>• Обратитесь к нашим специалистам по телефону или в чате</li>
                    <li>• Укажите номинал сертификата</li>
                    <li>• Произведите оплату любым удобным способом</li>
                    <li>• Получите электронный сертификат на указанный email</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">Как использовать сертификат?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground ml-13">
                    <li>• Оформите заказ на нашем сайте обычным способом</li>
                    <li>• При оформлении заказа укажите номер сертификата</li>
                    <li>• Стоимость покупки будет списана с баланса сертификата</li>
                    <li>• Остаток средств можно использовать для следующих покупок</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">Преимущества электронного сертификата</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground ml-13">
                    <li>• Удобный и быстрый способ оплаты</li>
                    <li>• Не нужно вводить данные карты при каждой покупке</li>
                    <li>• Можно использовать частями для нескольких покупок</li>
                    <li>• Отличный подарок для близких</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-lg font-medium mb-4">Есть вопросы по использованию сертификата?</p>
            <p className="text-muted-foreground mb-4">
              Свяжитесь с нами по телефону или напишите в чат — мы с радостью поможем!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+79030863091" className="text-primary hover:underline font-medium">
                +7 (903) 086 3091
              </a>
              <a href="tel:+73532935241" className="text-primary hover:underline font-medium">
                +7 (353) 293 5241
              </a>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default CertificatePage;
