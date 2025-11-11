// import { Trash2, Plus, Minus } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const CartPage = () => {
//   const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } =
//     useCart();

//   const handleQuantityChange = (productId: number, newQuantity: number) => {
//     updateQuantity(productId, newQuantity);
//     if (newQuantity === 0) {
//       toast({
//         title: "Товар удален из корзины",
//         description: "Товар был удален из вашей корзины.",
//       });
//     }
//   };

//   const handleRemoveItem = (productId: number, productName: string) => {
//     removeFromCart(productId);
//     toast({
//       title: "Товар удален из корзины",
//       description: `${productName} удален из корзины.`,
//     });
//   };

//   const handleClearCart = () => {
//     clearCart();
//     toast({
//       title: "Корзина очищена",
//       description: "Все товары удалены из корзины.",
//     });
//   };

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <main className="container mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <h1 className="text-3xl font-bold text-foreground mb-4">
//               Корзина пуста
//             </h1>
//             <p className="text-muted-foreground mb-8">
//               Добавьте товары в корзину, чтобы они появились здесь
//             </p>
//             <Link to="/catalog">
//               <Button>Перейти в каталог</Button>
//             </Link>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-foreground">Корзина</h1>
//           <Button variant="outline" onClick={handleClearCart}>
//             Очистить корзину
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Товары в корзине</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Товар</TableHead>
//                       <TableHead>Цена</TableHead>
//                       <TableHead>Количество</TableHead>
//                       <TableHead>Сумма</TableHead>
//                       <TableHead></TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {items.map((item) => (
//                       <TableRow
//                         key={`${item.id}-${item.selectedSize || "default"}`}
//                       >
//                         <TableCell>
//                           <div className="flex items-center space-x-4">
//                             <img
//                               src={item.images[0]}
//                               alt={item.name}
//                               className="w-16 h-16 object-cover rounded"
//                             />
//                             <div>
//                               <h4 className="font-medium">{item.name}</h4>
//                               <p className="text-sm text-muted-foreground">
//                                 {item.brand}
//                               </p>
//                               {item.selectedSize && (
//                                 <p className="text-sm text-muted-foreground">
//                                   Размер: {item.selectedSize}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>{item.price.toLocaleString()} ₽</TableCell>
//                         <TableCell>
//                           <div className="flex items-center space-x-2">
//                             <Button
//                               size="icon"
//                               variant="outline"
//                               onClick={() =>
//                                 handleQuantityChange(item.id, item.quantity - 1)
//                               }
//                               disabled={item.quantity <= 1}
//                             >
//                               <Minus size={16} />
//                             </Button>
//                             <span className="w-8 text-center">
//                               {item.quantity}
//                             </span>
//                             <Button
//                               size="icon"
//                               variant="outline"
//                               onClick={() =>
//                                 handleQuantityChange(item.id, item.quantity + 1)
//                               }
//                             >
//                               <Plus size={16} />
//                             </Button>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           {(item.price * item.quantity).toLocaleString()} ₽
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             onClick={() => handleRemoveItem(item.id, item.name)}
//                           >
//                             <Trash2 size={16} />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>

//           <div>
//             <Card className="sticky top-4">
//               <CardHeader>
//                 <CardTitle>Итого</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between">
//                   <span>
//                     Товары (
//                     {items.reduce((count, item) => count + item.quantity, 0)})
//                   </span>
//                   <span>{getCartTotal().toLocaleString()} ₽</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Доставка</span>
//                   <span>Бесплатно</span>
//                 </div>
//                 <hr />
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Итого</span>
//                   <span>{getCartTotal().toLocaleString()} ₽</span>
//                 </div>
//                 <Button className="w-full" size="lg">
//                   Оформить заказ
//                 </Button>
//                 <Link to="/catalog">
//                   <Button variant="outline" className="w-full">
//                     Продолжить покупки
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CartPage;
