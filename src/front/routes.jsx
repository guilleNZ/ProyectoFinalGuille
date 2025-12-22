import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { Single } from "./pages/Single";
import { Catalog } from "./pages/Catalog";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Favorites } from "./pages/Favorites";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Investment } from "./pages/Investment";
import { JoinTeam } from "./pages/JoinTeam";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/demo",
        element: <Demo />
      },
      {
        path: "/single/:theId",
        element: <Single />
      },
      {
        path: "/catalog",
        element: <Catalog />
      },
      {
        path: "/product/:id",
        element: <ProductDetail />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/checkout",
        element: <Checkout />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/favorites",
        element: <Favorites />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      
      {
        path: "/investment",
        element: <Investment />
      },
      
      {
        path: "/join-team",
        element: <JoinTeam />
      },
      {
        path: "/orders",
        element: <div className="container py-5"><h1>Mis Pedidos</h1></div>
      }
    ]
  }
]);