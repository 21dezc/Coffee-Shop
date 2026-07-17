import { Product, DEFAULT_PRODUCT_PRICE } from "../components/ProductCard";

export type Temperature = "ร้อน" | "เย็น" | "ปั่น";
export type Sweetness = "0%" | "25%" | "50%" | "75%" | "100%";
export const BLEND_SURCHARGE = 15; // ปั่น +15

export interface CartOptions {
  temperature?: Temperature;
  sweetness?: Sweetness;
}

export interface CartItem extends Product {
  cartItemId: string; // key ไม่ซ้ำ ต่อ product + options (สินค้าตัวเดียวกันแต่ตัวเลือกต่างกัน = คนละบรรทัดในตะกร้า)
  quantity: number;
  unitPrice: number; // ราคาต่อชิ้นหลังบวกส่วนเสริม (เช่น ปั่น +15)
  options?: CartOptions;
}

export const MAX_QUANTITY_PER_ITEM = 10;

export function buildCartItemId(productId: number, options?: CartOptions): string {
  if (!options) return `${productId}`;
  return `${productId}-${options.temperature ?? ""}-${options.sweetness ?? ""}`;
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; options?: CartOptions } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "LOAD_CART"; payload: CartItem[] };

export const cartReducer = (
  state: CartItem[],
  action: CartAction
): CartItem[] => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, options } = action.payload;
      const cartItemId = buildCartItemId(product.id, options);
      const basePrice = product.price ?? DEFAULT_PRODUCT_PRICE; // สินค้าที่ไม่มีราคา ใช้ราคาตั้งต้นแทน
      const unitPrice =
        basePrice + (options?.temperature === "ปั่น" ? BLEND_SURCHARGE : 0);

      const exist = state.find((item) => item.cartItemId === cartItemId);

      if (exist) {
        if (exist.quantity >= MAX_QUANTITY_PER_ITEM) {
          // ถึง limit แล้ว ไม่เพิ่มจำนวนต่อ
          return state;
        }
        return state.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...state,
        {
          ...product,
          cartItemId,
          quantity: 1,
          unitPrice,
          options,
        },
      ];
    }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.cartItemId !== action.payload);

    case "INCREASE_QUANTITY":
      return state.map((item) =>
        item.cartItemId === action.payload &&
        item.quantity < MAX_QUANTITY_PER_ITEM
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case "DECREASE_QUANTITY":
      return state
        .map((item) =>
          item.cartItemId === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
};