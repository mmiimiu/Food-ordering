import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiFetch("/orders").then(setOrders);
  }, []);

  return (
    <div className="page">
      <h2>ออเดอร์ของฉัน</h2>
      {orders.map(o => (
        <div key={o.id} className="card">
          <div>Order #{o.id}</div>
          <div>รวม {o.total_price} ฿</div>
          <div>สถานะอาหาร: {o.order_status}</div>
          <div>สถานะเงิน: {o.payment_status}</div>
        </div>
      ))}
    </div>
  );
}
