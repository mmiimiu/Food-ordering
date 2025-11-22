import { useEffect, useState } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiFetch("/restaurants")
      .then(setRestaurants)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="error">{err}</p>;

  return (
    <div className="page">
      <h2>ร้านอาหาร</h2>
      <div className="grid">
        {restaurants.map((r) => (
          <div className="card" key={r.id}>
            <h3>{r.name}</h3>
            <p>{r.address || "-"}</p>
            <Link to={`/menu/${r.id}`} className="link-btn">
              ดูเมนู
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
