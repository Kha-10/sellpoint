"use client";

import { ReactNode } from "react";
import { useLayout } from "@/app/(store)/[store]/contexts/LayoutContext";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import Sidebar from "@/app/(store)/[store]/components/sidebar";

export default function NavigationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { sidebarOpen, setSidebarOpen, storeData, categories } = useLayout();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNav setSidebarOpen={setSidebarOpen} storeData={storeData} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          storeData={storeData}
          categories={categories}
        />
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>
      </div>
    </div>
  );
}
