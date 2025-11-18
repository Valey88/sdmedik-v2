import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RotateCcw, CheckCircle, FileText, Phone } from "lucide-react";

const ReturnPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            Возврат товара
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Мы заботимся о наших клиентах и гарантируем возможность возврата
            товара
          </p>

          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">
                      Условия возврата
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed ml-13">
                    В соответствии с законодательством РФ, вы имеете право
                    вернуть товар надлежащего качества в течение 14 дней с
                    момента получения, если товар не был в употреблении и
                    сохранена его товарная упаковка.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">
                      Товары, подлежащие возврату
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground ml-13">
                    <li>• Товар не был в употреблении</li>
                    <li>• Сохранена товарная упаковка и все ярлыки</li>
                    <li>
                      • Товар сохранил товарный вид и потребительские свойства
                    </li>
                    <li>
                      • Есть документ, подтверждающий покупку (чек, накладная)
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">
                      Процедура возврата
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-2 text-muted-foreground list-decimal list-inside ml-13">
                    <li>Свяжитесь с нами по телефону или через чат на сайте</li>
                    <li>Сообщите номер заказа и причину возврата</li>
                    <li>Получите инструкции по отправке товара обратно</li>
                    <li>Отправьте товар в нашу компанию</li>
                    <li>
                      После проверки товара мы вернем деньги в течение 10
                      рабочих дней
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-semibold">Обмен товара</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed ml-13">
                    Если товар не подошел по размеру или другим параметрам, вы
                    можете обменять его на аналогичный товар. Для оформления
                    обмена свяжитесь с нашими специалистами, и мы поможем
                    подобрать подходящий вариант.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Важная информация</h3>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="font-semibold text-foreground">•</span>
                Товары медицинского назначения надлежащего качества не подлежат
                возврату и обмену, если они входят в перечень, утвержденный
                Постановлением Правительства РФ.
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-foreground">•</span>
                Стоимость обратной доставки товара оплачивается покупателем,
                если возврат происходит не по вине продавца.
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-foreground">•</span>
                При возврате товара ненадлежащего качества все расходы несет
                продавец.
              </p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <p className="text-lg font-medium mb-4">
              Есть вопросы по возврату товара?
            </p>
            <p className="text-muted-foreground mb-4">
              Свяжитесь с нами, и мы подробно проконсультируем вас по процедуре
              возврата
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
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
      </main>
    </div>
  );
};

export default ReturnPage;
