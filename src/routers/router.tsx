import LayoutWrapper from "@/components/LayoutWrapper";
import Blog from "@/pages/Blog";
import CertificatePage from "@/pages/CertificatePage";
import DeliveryPage from "@/pages/Delivery";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import ReturnPage from "@/pages/Return";
// import React, { useEffect, useState } from "react"; // Импортируйте React
import { createBrowserRouter } from "react-router-dom"; // Убедитесь, что импортируете правильно
// import HomePage from "../pages/home/HomePage";
// import СategoriesPage from "../pages/categories/СategoriesPage";
// import CatalogsLayout from "../pages/catalog/CatalogsLayout";
// import BasketLayout from "../pages/basket/BasketLayout";
// import Delivery from "../pages/delivery/Delivery";
// import About from "../pages/about/About";
// import Return_policy from "../pages/return_policy/Return_policy";
// import Deteils from "../pages/deteils/Deteils";
// import Auth from "../pages/account/Auth";
// import Register from "../pages/account/Register";
// import UserAccount from "../pages/account/UserAccount";
// import Electronic_certificate from "../pages/electronic_certificate/Electronic_certificate";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PropsWithChildren } from "react";
import CategoryCatalog from "@/pages/CategoryCatalog";
import CategoryPage from "@/pages/CategoryPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import ProductListPage from "@/components/admin/product/ProductListPage";
import ProductCreatePage from "@/components/admin/product/ProductCreatePage";
import ProductEditPage from "@/components/admin/product/ProductEditPage";
import CartPage from "@/pages/CartPage";
import ProductPage from "@/pages/ProductPage";
import CategoriesListPage from "@/components/admin/category/CategoryListPage";
import CategoryCreatePage from "@/components/admin/category/CategoryCreatePage";
import CategoryEditPage from "@/components/admin/category/CategoryEditPage";
import Payments from "@/pages/Payments";
import OrdersListPage from "@/components/admin/orders/OrdersListPage";
// import CreateProduct from "../pages/admin/create_product/CreateProduct";
// import Contacts from "../pages/contacts/Contacts";
// import CreateCategory from "../pages/admin/create_category/CreateCategory";
// import AdminDashboard from "../pages/admin/AdminLayout";
// import UpdateProduct from "../pages/admin/update_product/UpdateProduct";
// import AdminCategoriesTable from "../pages/admin/components_admin_page/AdminCategoriesTable/AdminCategoriesTable";
// import axios from "axios";
// import useUserStore from "../store/userStore";
// import MainContent from "../pages/admin/components_admin_page/MainContent/MainContent";
// import AdminUserTable from "../pages/admin/components_admin_page/AdminUserTable/AdminUserTable";
// import AdminProductTable from "../pages/admin/components_admin_page/AdminProductTable/AdminProductTable";
// import Paymants from "../pages/paymants/Paymants";
// import PayOnclick from "../pages/pay_onclick/PayOnclick";
// import CategoriesForCertificate from "../pages/categories_for_certificate/CategoriesForCertificate";
// import CatalogsCertificateLayout from "../pages/catalog/CatalogsCertificateLayout";
// import ProductDynamicCertificatePage from "../pages/Product/ProductDynamicCertificatePage";
// import LayoutWrapper from "../global/LayoutWrapper";
// import NotFound from "../pages/notfound/NotFound";
// import RessetPassword from "../global/components/RessetPassword";
// import BlogList from "../pages/blog-list/BlogList";
// import Post from "../pages/post/Post";

// const UsersRoute = ({ children }) => {
//   const isLoggedIn = Cookies.get("logged_in") === "true";

//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// export default UsersRoute;

// export const AdminRoute = ({ children }) => {
//   const { isAdmin, isLoadingUser } = useUserStore();

//   if (isLoadingUser) return <div>Проверка прав доступа...</div>;

//   return isAdmin() ? children : <Navigate to="/" replace />;
// };

const UsersRoute = ({ children }: PropsWithChildren) => {
  const isLoggedIn = Cookies.get("logged_in") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// export const AdminRoute = ({ children }) => {
//   const { getUserInfo, user } = useUserStore();
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     getUserInfo();
//     setLoading(false);
//   }, [getUserInfo]);

//   useEffect(() => {
//     if (user?.data) {
//       setIsAdmin(user.data.role_id === 1);
//     }
//   }, [user]);

//   if (loading) {
//     return <div>Loading...</div>; // Можно добавить индикатор загрузки
//   }

//   if (!isAdmin) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

export const router = createBrowserRouter([
  // 1. Публичные маршруты (С Хедером и Футером)
  {
    element: <LayoutWrapper />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/certificate", element: <CertificatePage /> },
      { path: "/blog", element: <Blog /> },
      { path: "/return", element: <ReturnPage /> },
      { path: "/catalog", element: <CategoryCatalog /> },
      { path: "/products/:id", element: <CategoryPage /> },
      { path: "/delivery", element: <DeliveryPage /> },
      { path: "/returnpolicy", element: <ReturnPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/product/:id", element: <ProductPage /> },
      { path: "/pay", element: <Payments /> },

      // Защищенный маршрут профиля (тоже с хедером/футером)
      {
        path: "/profile",
        element: (
          <UsersRoute>
            <Profile />
          </UsersRoute>
        ),
      },
    ],
  },

  // 2. Админ панель (БЕЗ Хедера и Футера сайта)
  // Мы вынесли это из children LayoutWrapper
  {
    path: "/admin",
    element: <AdminLayout />, // Внутри AdminLayout свой хедер и сайдбар
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "orders",
        element: <OrdersListPage />,
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: "products/new", // Важно: new перед :id, иначе new воспримется как id
        element: <ProductCreatePage />,
      },
      {
        path: "products/:id/edit", // Или просто "update_product/:id", как у тебя было
        element: <ProductEditPage />,
      },
      {
        path: "categories",
        element: <CategoriesListPage />,
      },
      {
        path: "category/new", // Или "categories/new"
        element: <CategoryCreatePage />,
      },
      {
        path: "category/:id/edit", // Или "categories/:id/edit"
        element: <CategoryEditPage />,
      },
      // Добавь сюда остальные админские маршруты...
    ],
  },

  // 3. Страница 404 (Можно обернуть в LayoutWrapper, если нужно)
  // {
  //   path: "*",
  //   element: (
  //     <LayoutWrapper>
  //       <NotFound />
  //     </LayoutWrapper>
  //   ),
  // },
]);
