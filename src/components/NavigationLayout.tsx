"use client";

import { ReactNode } from "react";
import { useLayout } from "@/app/contexts/LayoutContext";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/sidebar";
import { CartProvider } from "../app/providers/CartContext";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";

export default function NavigationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { sidebarOpen, setSidebarOpen, storeData, categories } = useLayout();
  const pathname = usePathname();

  // decide if we should hide the sidebar
 const hideSidebar = pathname.startsWith(`/product/`) || pathname.startsWith(`/checkout`) || pathname.startsWith(`/orders/`) 

  return (
    <CartProvider>
      <div className="flex h-screen bg-white">
        {!hideSidebar && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            categories={categories}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav setSidebarOpen={setSidebarOpen} storeData={storeData} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-auto">
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
