// import { useState, useMemo } from "react";
// import { products } from "@/data/products";
// import Header from "@/components/Header";
// import ProductFilters from "@/components/ProductFilters";
// import ProductCard from "@/components/ProductCard";
// import { PriceRange } from "@/types/Product";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// const Catalog = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [priceRange, setPriceRange] = useState<PriceRange>({
//     min: 0,
//     max: 150000,
//   });
//   const [sortBy, setSortBy] = useState("");

//   const filteredProducts = useMemo(() => {
//     let filtered = products.filter((product) => {
//       // Поиск по названию
//       const matchesSearch = product.name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());

//       // Фильтр по категориям
//       const matchesCategory =
//         selectedCategories.length === 0 ||
//         selectedCategories.includes(product.category);

//       // Фильтр по брендам
//       const matchesBrand =
//         selectedBrands.length === 0 || selectedBrands.includes(product.brand);

//       // Фильтр по цене
//       const matchesPrice =
//         product.price >= priceRange.min && product.price <= priceRange.max;

//       return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
//     });

//     // Сортировка
//     if (sortBy === "price-asc") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "price-desc") {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === "rating") {
//       filtered.sort((a, b) => b.rating - a.rating);
//     } else if (sortBy === "name") {
//       filtered.sort((a, b) => a.name.localeCompare(b.name));
//     }

//     return filtered;
//   }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 py-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-foreground mb-4">
//               Каталог товаров
//             </h1>

//             {/* Поиск */}
//             <div className="relative max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 placeholder="Поиск товаров..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Фильтры */}
//             <div className="lg:col-span-1">
//               <div className="sticky top-8">
//                 <ProductFilters
//                   onPriceChange={setPriceRange}
//                   onCategoryChange={setSelectedCategories}
//                   onBrandChange={setSelectedBrands}
//                   onSortChange={setSortBy}
//                   selectedCategories={selectedCategories}
//                   selectedBrands={selectedBrands}
//                   priceRange={priceRange}
//                 />
//               </div>
//             </div>

//             {/* Товары */}
//             <div className="lg:col-span-3">
//               <div className="mb-6 flex items-center justify-between">
//                 <p className="text-muted-foreground">
//                   Найдено товаров: {filteredProducts.length}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {filteredProducts.map((product) => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
//               </div>

//               {filteredProducts.length === 0 && (
//                 <div className="text-center py-12">
//                   <p className="text-muted-foreground text-lg">
//                     По вашему запросу ничего не найдено
//                   </p>
//                   <p className="text-muted-foreground">
//                     Попробуйте изменить параметры поиска
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Catalog;
