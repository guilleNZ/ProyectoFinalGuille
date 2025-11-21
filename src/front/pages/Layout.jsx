import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { InternalNavbar } from "../components/InternalNavbar";
import ScrollToTop from "../components/ScrollToTop";
import { Footer } from "../components/Footer";

export const Layout = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // check the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // check donde estamos
  const isSplashPage = location.pathname === "/splash";

  // render de Navbar q necesitamos
  const renderNavbar = () => {
    if (isSplashPage) return <Navbar />;
    return isLoggedIn ? <InternalNavbar setIsLoggedIn={setIsLoggedIn} /> : <Navbar />;
  };

  return (
    <>
      <ScrollToTop />

     
      {renderNavbar()}

     
      <main>
        <Outlet />
      </main>

      
      <Footer />
    </>
  );
};
