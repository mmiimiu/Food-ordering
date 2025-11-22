import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Orders from "./pages/Orders.jsx";
import Restaurants from "./pages/Restaurants.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />

        {/* เมนูต้องมี restaurant id */}
        <Route path="/menu/:id" element={<Menu />} />
        <Route path="/menu" element={<Navigate to="/menu/1" />} />

        <Route path="/orders" element={<Orders />} />

        {/* กัน path แปลก ๆ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
