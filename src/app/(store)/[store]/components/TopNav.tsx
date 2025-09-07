"use client";

import { Menu, ShoppingCart } from "lucide-react";
import { StoreData } from "@/lib/api";
import { useCart } from "@/app/(store)/[store]/providers/CartContext";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  setSidebarOpen: (open: boolean) => void;
  currentPage?: "home" | "search";
  storeData: StoreData;
}

export default function TopNav({ setSidebarOpen, storeData }: TopNavProps) {
  const { state, dispatch } = useCart();
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <Menu className="h-5 w-5 text-gray-600 hover:text-gray-900" />
        </button>
        <div className="hidden lg:flex items-center">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            {storeData?.name}
          </h1>
        </div>
      </div>

      <div className="lg:hidden flex items-center">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
          <ShoppingCart className="h-5 w-5 text-gray-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          {storeData?.name}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
          <ShoppingCart className="h-5 w-5" />
        </button> */}
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={() => {
            console.log("clicked");
            dispatch({ type: "TOGGLE_CART" });
          }}
        >
          <ShoppingCart className="h-5 w-5" />
          {state.items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {state.items.length}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
