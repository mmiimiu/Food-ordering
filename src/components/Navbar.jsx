// src/component/Navbar.jsx
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart, total } = useCart();

  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar">
      {/* โลโก้/ชื่อเว็บ */}
      <NavLink to="/" className="brand">
        🍝 Food Ordering
      </NavLink>

      {/* เมนู */}
      <div className="nav-links">
        <NavLink to="/restaurants" className={linkClass}>
          🏪 ร้านอาหาร
        </NavLink>

        {/* ถ้าเข้าเมนูแบบมี id ให้ลิงก์ไป /menu/1 ก่อน
            (ถ้าโปรเจคเธอใช้ /menu เฉยๆ ก็เปลี่ยนเป็น "/menu") */}
        <NavLink to="/menu/1" className={linkClass}>
          🍽️ เมนูอาหาร
        </NavLink>

        <NavLink to="/orders" className={linkClass}>
          📦 ออเดอร์ของฉัน
        </NavLink>
      </div>

      {/* ตะกร้า (มุมขวา) */}
      <NavLink to="/orders" className="cart-pill">
        🛒 {cart.length} รายการ
        <span className="cart-total">{total}฿</span>
      </NavLink>
    </nav>
  );
}

