import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function Rider() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiFetch("/orders").then(setOrders);
  }, []);

  const update = async (id, order_status) => {
    await apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ order_status }),
    });
    setOrders(o => o.map(x => x.id === id ? { ...x, order_status } : x));
  };

  return (
    <div className="page">
      <h2>Rider (Prototype)</h2>
      {orders.map(o => (
        <div key={o.id} className="card">
          <div>Order #{o.id}</div>
          <div>สถานะ: {o.order_status}</div>

          <button onClick={() => update(o.id, "DELIVERING")}>
            รับงาน
          </button>
          <button onClick={() => update(o.id, "DONE")}>
            ส่งสำเร็จ
          </button>
        </div>
      ))}
    </div>
  );
}
