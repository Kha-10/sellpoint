"use client";

import { Menu, ShoppingCart, Home, Search } from "lucide-react";
import Link from "next/link";
import { StoreData } from "@/lib/api"

interface TopNavProps {
  setSidebarOpen: (open: boolean) => void;
  currentPage?: "home" | "search";
  storeData : StoreData
}

export default function TopNav({
  setSidebarOpen,
  currentPage = "home",
  storeData
}: TopNavProps) {
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <Menu className="h-5 w-5 text-destructive" />
        </button>
        <div className="hidden lg:flex items-center">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{storeData?.name}</h1>
        </div>
      </div>

      <div className="lg:hidden flex items-center">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
          <ShoppingCart className="h-5 w-5 text-gray-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{storeData?.name}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className={`p-2 rounded-lg transition-colors ${
            currentPage === "home"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Home className="h-5 w-5" />
        </Link>
        <Link
          href="/search"
          className={`p-2 rounded-lg transition-colors ${
            currentPage === "search"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Search className="h-5 w-5" />
        </Link>
        <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
