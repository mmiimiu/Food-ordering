import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <h1>ระบบสั่งอาหารออนไลน์</h1>
      <p>เลือกหน้าที่ต้องการ</p>

      <div className="home-links">
        <Link to="/restaurants" className="home-btn">🏪 ร้านอาหาร</Link>
        <Link to="/menu/1" className="home-btn">🍽️ เมนูอาหาร</Link>
        <Link to="/orders" className="home-btn">📦 คำสั่งซื้อ</Link>
      </div>
    </div>
  );
}
