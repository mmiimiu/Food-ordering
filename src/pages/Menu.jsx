// src/pages/Menu.jsx
import { useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../api/api";

export default function Menu() {
  const nav = useNavigate();
  const { id } = useParams();
  const restaurantId = id || 1;

  const { cart, total, add, clear } = useCart();
  const [loading, setLoading] = useState(false);

  const menus = useMemo(
    () => [
      {
        id: 1,
        name: "Bruschetta (บรูเชตตา)",
        ingredients:
          "Toasted bread (baguette or ciabatta), fresh diced tomatoes, garlic, olive oil, and fresh basil.",
        price: 120,
        image: "/images/1.webp",
      },
      {
        id: 2,
        name: "Lasagna (ลาซานญา)",
        ingredients:
          "Lasagna noodles, meat sauce (often ground beef or sausage, tomatoes, and herbs), ricotta cheese, and mozzarella cheese.",
        price: 220,
        image: "/images/2.webp",
      },
      {
        id: 3,
        name: "Pasta Carbonara (พาสต้า คาโบนาร่า)",
        ingredients:
          "Pasta (spaghetti), Guanciale (or pancetta/bacon), egg yolks, Pecorino Romano cheese, and black pepper.",
        price: 180,
        image: "/images/3.webp",
      },
      {
        id: 4,
        name: "Pizza (พิซซ่า)",
        ingredients:
          "Pizza dough (flour, yeast, water, oil), tomato sauce, and mozzarella cheese.",
        price: 250,
        image: "/images/4.webp",
      },
      {
        id: 5,
        name: "Ossobuco (ออสโซบูโก)",
        ingredients:
          "Cross-cut veal shanks braised with onion, carrot, celery, white wine, and broth (served with gremolata).",
        price: 320,
        image: "/images/5.webp",
      },
      {
        id: 6,
        name: "Focaccia (ฟอคคาเซีย)",
        ingredients:
          "Flatbread dough (flour, yeast, water, salt) topped with olive oil, rosemary, and flaky sea salt.",
        price: 90,
        image: "/images/6.webp",
      },
      {
        id: 7,
        name: "Prosciutto (โพรชูโต)",
        ingredients:
          "Cured hind leg of a pig and salt (dry-cured ham, thinly sliced).",
        price: 160,
        image: "/images/7.webp",
      },
      {
        id: 8,
        name: "Risotto (ริซอตโต)",
        ingredients:
          "Arborio rice, broth, onion, butter, white wine (optional), and Parmesan cheese.",
        price: 200,
        image: "/images/8.webp",
      },
      {
        id: 9,
        name: "Tiramisu (ทีรามิสุ)",
        ingredients:
          "Ladyfingers dipped in coffee, mascarpone, egg yolks, sugar, cocoa powder.",
        price: 140,
        image: "/images/9.webp",
      },
      {
        id: 10,
        name: "Minestrone Soup (ซุปมิเนสโตรเน)",
        ingredients:
          "Seasonal vegetables, beans, small pasta/rice in tomato-based broth.",
        price: 130,
        image: "/images/10.webp",
      },
      {
        id: 11,
        name: "Gelato (เจลาโต้)",
        ingredients:
          "Milk, cream, sugar + flavorings (fruit, nuts, chocolate).",
        price: 110,
        image: "/images/11.webp",
      },
    ],
    []
  );

  const checkout = useCallback(async () => {
    if (loading) return; // กันกดรัว
    if (cart.length === 0) return alert("ยังไม่มีรายการอาหาร");

    setLoading(true);
    try {
      const items = cart.map((m) => ({
        menu_id: m.id,
        qty: m.qty || 1,
      }));

      await apiFetch(`/restaurants/${restaurantId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total_price: total,
        }),
      });

      alert("สั่งอาหารสำเร็จ!");
      clear();
      nav("/orders");
    } catch (e) {
      console.error(e);
      alert("สั่งไม่สำเร็จ: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [cart, total, restaurantId, clear, nav, loading]);

  return (
    <div className="page">
      <h2 style={{ marginBottom: 12 }}>อาหารอิตาเลียน</h2>

      <div className="grid">
        {menus.map((m) => (
          <MenuCard key={m.id} menu={m} onAdd={() => add(m)} />
        ))}
      </div>

      <div className="checkout-bar">
        <span>
          รวม: {total} ฿ ({cart.length} รายการ)
        </span>

        <button
          type="button"
          onClick={checkout}
          disabled={cart.length === 0 || loading}
        >
          {loading ? "กำลังสั่ง..." : "ยืนยันคำสั่งซื้อ"}
        </button>
      </div>
    </div>
  );
}
