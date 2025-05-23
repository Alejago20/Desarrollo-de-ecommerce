import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import {
  HomePage,
  CellPhone,
  AboutPage,
  CellPhoneProduct,
  LoginPage,
  RegisterPage,
  OrdersUserPage,
  ThankYouPage,
  OrderUserPage,
  DashboardOrdersPage,
  DashboardOrderPage,
} from "../pages";
import { ClientLayout } from "../layouts/ClientLayout";
import CheckoutPage from "../pages/CheckoutPage";
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardProductsPage } from '../pages/dashboard/DashboardProductsPage';
import { DashboardNewProductsPage } from "../pages/dashboard/DashboardNewProductsPage";
import DashboardProductSlugPage from "../pages/dashboard/DashboardProductSlugPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // <- Ruta predeterminada cuando se accede a "/
        element: <HomePage />,
      },
      {
        path: "celulares",
        element: <CellPhone />,
      },
      {
        path: "celulares/:slug",
        element: <CellPhoneProduct />,
      },
      {
        path: "nosotros",
        element: <AboutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "registro",
        element: <RegisterPage />,
      },
      {
        path: "account",
        element: <ClientLayout />,
        children: [
          {
            path: "",
            element: <Navigate to="/account/pedidos" />,
          },
          {
            path: "pedidos",
            element: <OrdersUserPage />,
          },
          {
            path: "pedidos/:id",
            element: <OrderUserPage />,
          },
        ],
      },
    ],
  },

  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/checkout/:id/thank-you",
    element: <ThankYouPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout/>,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/productos"/>,
      },
      {
        path: "productos",
        element: <DashboardProductsPage/>,
      },
      {
        path: "productos/new",
        element: <DashboardNewProductsPage/>,
      },
      {
        path: "productos/editar/:slug",
        element: <DashboardProductSlugPage/>,
      },
      {
				path: 'ordenes',
				element: <DashboardOrdersPage />,
			},
			{
				path: 'ordenes/:id',
				element: <DashboardOrderPage />,
			},
    ],
  },
]);
