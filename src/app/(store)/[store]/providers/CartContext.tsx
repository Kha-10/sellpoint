"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface Inventory {
  _id: string | Types.ObjectId;
  quantity: number;
}

export interface FlexibleOptionItem {
  name: string;
  amount?: number; // defaults to 0
}

export type OptionType = "Checkbox" | "Selection" | "Number" | "Text";

export interface OptionSettings {
  min?: number;
  max?: number;
  inputType?: string;
  enableQuantity?: boolean;
  choices?: FlexibleOptionItem[];
}

export interface Option {
  name: string;
  type: OptionType;
  required?: boolean; // defaults to false
  value?: string; // defaults to ""
  settings?: OptionSettings;
}

export interface Variant {
  name: string;
  price: number;
  originalPrice?: number; // defaults to 0
}

export type ProductType = "physical" | "digital" | "service";

export interface Product {
  _id?: string;
  name: string;
  visibility?: string; // defaults to "visible"
  categories?: (string)[];
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

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: Record<string, any>;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = {
        ...action.payload,
        id: Date.now().toString(),
      };
      const items = [...state.items, newItem];
      return {
        ...state,
        items,
        total: items.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items,
        total: items.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    case "UPDATE_QUANTITY": {
      const items = state.items.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: action.payload.quantity,
              totalPrice: item.product.price * action.payload.quantity,
            }
          : item
      );
      return {
        ...state,
        items,
        total: items.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [], total: 0 };
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
    total: 0,
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
