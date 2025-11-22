import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useState } from "react";

export default function Pay() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    setLoading(true);
    try {
      await apiFetch(`/orders/${id}/pay`, { method: "POST" });
      alert("ชำระเงินสำเร็จ!");
      nav("/orders");
    } catch (e) {
      alert("จ่ายไม่สำเร็จ: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>ชำระเงิน (จำลอง)</h2>
      <p>Order ID: {id}</p>

      <button onClick={payNow} disabled={loading}>
        {loading ? "กำลังชำระ..." : "จ่ายเงินตอนนี้"}
      </button>
    </div>
  );
}
