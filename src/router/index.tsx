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
  OrderUserPage
 

} from "../pages";
import { ClientLayout } from "../layouts/ClientLayout";
import CheckoutPage from "../pages/CheckoutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
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
            element: <OrdersUserPage/>,
          },
          {
            path: "pedidos/:id",
            element: <OrderUserPage/>,
          }
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
    element: <ThankYouPage/>,
  }
]);
