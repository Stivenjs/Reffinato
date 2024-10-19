import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import Login from "@/pages/login-registration/Login";
import Register from "@/pages/login-registration/Register";
import ResetPassword from "@/pages/password-reset/ResetPassword";
import Home from "@/pages/home/Home";
import Products from "@/components/shared/Products";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ProductsDetails from "@/components/shared/ProductsDetails";
import RefinnatoGold from "@/components/shared/ReffinatoGold";
import NewsLetter from "@/components/shared/NewsLetter";
import StorePolicies from "@/components/shared/StorePolicies";
import ScrollToTop from "@/components/shared/ScrollToTop";
import SizeGuide from "@/components/shared/SizeGuide";
import UpdateProfile from "@/pages/preferences-orders/UpdateProfile";
import ShoppingCart from "@/components/shared/ShoppingCart";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import AdminProductForm from "@/pages/admin/AdminProductForm";
function AppRoutes() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const authRoutes = ["/login", "/register", "/reset-password"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <>
      {!isAuthRoute && <Header isScrolled={isScrolled} />}
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products-details/:id" element={<ProductsDetails />} />
        <Route path="/reffinato-gold" element={<RefinnatoGold />} />
        <Route path="/store-policies" element={<StorePolicies />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin/add-product" element={<AdminProductForm />} />
      </Routes>
      {!isAuthRoute && <Toaster />}
      {!isAuthRoute && <NewsLetter />}
      {!isAuthRoute && <Footer />}
    </>
  );
}

export default AppRoutes;
