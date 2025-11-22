import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const add = (menu) => {
    setCart((prev) => [...prev, menu]);
  };

  const removeAt = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clear = () => setCart([]);

  const total = useMemo(
    () => cart.reduce((sum, m) => sum + (m.price || 0), 0),
    [cart]
  );

  const value = { cart, add, removeAt, clear, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
