"use client";

import { createContext, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import { catalogPreviewProducts } from "@/lib/content/catalog-preview";
import { cartReducer, getCartItemCount, initialCartState, resolvePreviewCartProduct, type CartState } from "@/lib/cart/cart-state";

type CartContextValue = {
  state: CartState;
  itemCount: number;
  addPreviewItem: (productId: string) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [announcement, setAnnouncement] = useState("");

  const value = useMemo<CartContextValue>(() => ({
    state,
    itemCount: getCartItemCount(state),
    addPreviewItem(productId) {
      const product = resolvePreviewCartProduct(productId, catalogPreviewProducts);
      if (!product) {
        setAnnouncement("This item is not eligible for the preview cart.");
        return;
      }
      dispatch({ type: "add", product });
      setAnnouncement(`${product.name} added to the local preview cart.`);
    },
    increase(productId) {
      const item = state.items.find((candidate) => candidate.id === productId);
      if (!item) return;
      dispatch({ type: "increase", productId });
      setAnnouncement(`${item.name} quantity increased.`);
    },
    decrease(productId) {
      const item = state.items.find((candidate) => candidate.id === productId);
      if (!item || item.quantity <= 1) return;
      dispatch({ type: "decrease", productId });
      setAnnouncement(`${item.name} quantity decreased.`);
    },
    remove(productId) {
      const item = state.items.find((candidate) => candidate.id === productId);
      if (!item) return;
      dispatch({ type: "remove", productId });
      setAnnouncement(`${item.name} removed from the local preview cart.`);
    },
    clear() {
      if (!state.items.length) return;
      dispatch({ type: "clear" });
      setAnnouncement("Local preview cart cleared.");
    },
  }), [state]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
