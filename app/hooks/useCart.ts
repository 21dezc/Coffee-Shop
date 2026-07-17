"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Product } from "../components/ProductCard";
import {
  cartReducer,
  CartItem,
  CartOptions,
  MAX_QUANTITY_PER_ITEM,
  buildCartItemId,
} from "../reducers/cartReducer";

const CART_STORAGE_KEY = "cart";

export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, [] as CartItem[]);
  const [warning, setWarning] = useState<string | null>(null);

  // โหลด cart จาก localStorage ตอน mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      const items: CartItem[] = JSON.parse(savedCart);

      dispatch({
        type: "LOAD_CART",
        payload: items,
      });
    }
  }, []);

  // sync cart ลง localStorage ทุกครั้งที่ cart เปลี่ยน
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, options?: CartOptions) => {
      const cartItemId = buildCartItemId(product.id, options);
      const existing = cart.find((item) => item.cartItemId === cartItemId);

      if (existing && existing.quantity >= MAX_QUANTITY_PER_ITEM) {
        setWarning(`${product.name} สั่งได้สูงสุด ${MAX_QUANTITY_PER_ITEM} แก้ว/ชิ้นต่อออเดอร์`);
        return;
      }

      dispatch({ type: "ADD_TO_CART", payload: { product, options } });
    },
    [cart]
  );

  const increaseQuantity = useCallback(
    (cartItemId: string) => {
      const existing = cart.find((item) => item.cartItemId === cartItemId);

      if (existing && existing.quantity >= MAX_QUANTITY_PER_ITEM) {
        setWarning(`${existing.name} สั่งได้สูงสุด ${MAX_QUANTITY_PER_ITEM} แก้ว/ชิ้นต่อออเดอร์`);
        return;
      }

      dispatch({ type: "INCREASE_QUANTITY", payload: cartItemId });
    },
    [cart]
  );

  const decreaseQuantity = useCallback((cartItemId: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: cartItemId });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: cartItemId });
  }, []);

  const dismissWarning = useCallback(() => setWarning(null), []);

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return {
    cart,
    dispatch,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    warning,
    dismissWarning,
    totalPrice,
    totalCount,
  };
}
