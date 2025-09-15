"use client";
import TabNavigation from "../components/TabNavigation";
import CategoriesList from "../components/CategoriesList";
import { useLayout } from "@/app/contexts/LayoutContext";

export default function Home() {
  const { storeData, categories } = useLayout();

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex-1 p-4 lg:p-6">
        <TabNavigation currentTab="home" />
        <CategoriesList
          categories={categories?.data || []}
          storeData={storeData}
        />
      </div>
    </div>
  );
}
