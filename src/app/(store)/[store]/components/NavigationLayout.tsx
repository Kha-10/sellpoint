"use client";

import { ReactNode } from "react";
import { useLayout } from "@/app/(store)/[store]/contexts/LayoutContext";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import Sidebar from "@/app/(store)/[store]/components/sidebar";
import { CartProvider } from "../providers/CartContext";
import { usePathname } from "next/navigation";
import CartDrawer from "@/app/(store)/[store]/components/CartDrawer";

export default function NavigationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { sidebarOpen, setSidebarOpen, storeData, categories } = useLayout();
  const pathname = usePathname();

  // decide if we should hide the sidebar
  const hideSidebar = pathname.startsWith("/story-appetizers/product/");

  return (
    <CartProvider>
      <div className="flex h-screen bg-white">
        {!hideSidebar && (
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            storeData={storeData}
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
