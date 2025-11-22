import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // เพิ่มอาหารลงตะกร้า
  function add(menu) {
    setCart([...cart, menu]);
  }

  // ลบอาหาร
  function remove(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  // ล้างตะกร้า
  function clear() {
    setCart([]);
  }

  // คำนวนราคารวม
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, add, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
