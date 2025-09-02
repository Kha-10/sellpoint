"use client";

import { useState } from "react";
import Sidebar from "@/app/(store)/[store]/components/sidebar";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData } from "@/lib/api";
import { Category } from "@/lib/api";
import CategoriesList from "./components/CategoriesList";

interface HomeClientProps {
  storeData: StoreData;
  categories: Category[];
}

export default function HomeClient({ storeData, categories }: HomeClientProps) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNav
        setSidebarOpen={setSidebarOpen}
        currentPage="home"
        storeData={storeData}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          storeData={storeData}
        />

        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-4 lg:p-6">
            <TabNavigation currentTab="home" storeData={storeData} />

            <CategoriesList categories={categories} storeData={storeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
