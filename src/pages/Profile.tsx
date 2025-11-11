import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const [userData] = useState({
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67"
  });

  const orders = [
    {
      id: "ORD-001",
      date: "15.01.2025",
      status: "Доставлен",
      total: 23500,
      items: 3
    },
    {
      id: "ORD-002",
      date: "10.01.2025",
      status: "В пути",
      total: 15000,
      items: 1
    }
  ];

  const favorites = [
    {
      id: "1",
      name: "Кресло-коляска инвалидная",
      price: 15000,
      image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=200&h=200&fit=crop"
    },
    {
      id: "2",
      name: "Противопролежневый матрас",
      price: 8500,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop"
    }
  ];

  return (
    <>
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Личный кабинет</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 mr-2" />
                Мои заказы
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="h-4 w-4 mr-2" />
                Избранное
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Настройки
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Персональная информация</CardTitle>
                  <CardDescription>
                    Управляйте своими личными данными
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input id="name" defaultValue={userData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userData.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" defaultValue={userData.phone} />
                  </div>
                  <Button>Сохранить изменения</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">История заказов</h2>
                {orders.map((order) => (
                  <Card key={order.id} className="hover-lift card-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">Заказ {order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                          <p className="text-sm mt-2">Товаров: {order.items}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            order.status === "Доставлен" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-xl font-bold text-primary mt-2">
                            {order.total.toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4">
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Избранные товары</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item) => (
                    <Card key={item.id} className="hover-lift card-shadow">
                      <CardContent className="p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <p className="text-xl font-bold text-primary mb-4">
                          {item.price.toLocaleString("ru-RU")} ₽
                        </p>
                        <div className="flex gap-2">
                          <Button className="flex-1">В корзину</Button>
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки аккаунта</CardTitle>
                  <CardDescription>
                    Управление безопасностью и уведомлениями
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Текущий пароль</Label>
                    <Input id="old-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Новый пароль</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="flex gap-3">
                    <Button>Изменить пароль</Button>
                    <Button variant="destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Profile;
