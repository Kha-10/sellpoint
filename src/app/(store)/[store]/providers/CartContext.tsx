"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Category } from "@/lib/api";

export interface Inventory {
  _id: string;
  quantity: number;
}

interface FlexibleOptionItem {
  name: string;
  amount?: number;
}

export interface Option {
  name: string;
  type: "Checkbox" | "Selection" | "Number" | "Text";
  required?: boolean;
  value?: string;
  settings?: {
    min?: number;
    max?: number;
    inputType?: string;
    enableQuantity?: boolean;
    choices?: FlexibleOptionItem[];
  };
}

export interface Variant {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number | null; // defaults to 0
}

export type ProductType = "physical" | "digital" | "service";

export interface Product {
  _id?: string;
  name: string;
  visibility?: string; // defaults to "visible"
  categories?: Category[];
  type: ProductType;
  price: number;
  originalPrice?: number; // defaults to 0
  description?: string;
  photo?: string[];
  imgUrls?: string[];
  variants?: Variant[];
  options?: Option[];
  trackQuantityEnabled?: boolean; // defaults to false
  inventory?: Inventory;
  dailyCapacity?: boolean; // defaults to false
  cartMaximumEnabled?: boolean; // defaults to false
  cartMaximum?: number; // defaults to 0
  cartMinimumEnabled?: boolean; // defaults to false
  cartMinimum?: number; // defaults to 0
  sku?: string;
  storeId: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface OptionItem {
  name: string;
  answers?: (string | number)[];
  prices?: number[];
  quantities?: number[];
}

interface Item
  extends Pick<
    Product,
    | "cartMinimum"
    | "cartMaximum"
    | "categories"
    | "imgUrls"
    | "photo"
    | "trackQuantityEnabled"
  > {
  productId: string;
  productName: string;
  productinventory: number;
  basePrice: number;
  totalPrice: number;
  quantity: number;
  variantId: string;
  options: OptionItem[];
}

export interface CartItem {
  cartId: string | null;
  items: Item;
  basePrice: number;
  totalPrice: number;
}

export interface CartItemResponse
  extends Pick<
    Product,
    | "cartMinimum"
    | "cartMaximum"
    | "categories"
    | "imgUrls"
    | "photo"
    | "trackQuantityEnabled"
  > {
  id: string; // from backend
  productId: string;
  productName: string;
  productinventory: number;
  basePrice: number;
  totalPrice: number;
  quantity: number;
  variantId: string;
  options: OptionItem[];
}

interface CartState {
  items: CartItemResponse[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItemResponse[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const items: CartItemResponse[] = action.payload;

      console.log("newItem", items);

      // const items = newItem;
      return {
        ...state,
        items,
      };
    }
    // case "REMOVE_ITEM": {
    //   const items = state.items.filter((item) => item.id !== action.payload);
    //   return {
    //     ...state,
    //     items,
    //     total: items.reduce((sum, item) => sum + item.totalPrice, 0),
    //   };
    // }
    // case "UPDATE_QUANTITY": {
    //   const items = state.items.map((item) =>
    //     item.id === action.payload.id
    //       ? {
    //           ...item,
    //           quantity: action.payload.quantity,
    //           totalPrice: item.product.price * action.payload.quantity,
    //         }
    //       : item
    //   );
    //   return {
    //     ...state,
    //     items,
    //     total: items.reduce((sum, item) => sum + item.totalPrice, 0),
    //   };
    // }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
