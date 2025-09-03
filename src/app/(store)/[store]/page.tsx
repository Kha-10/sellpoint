"use client";
import TabNavigation from "./components/TabNavigation";
import CategoriesList from "./components/CategoriesList";
import { useLayout } from "@/app/(store)/[store]/contexts/LayoutContext";

export default function Home() {
  const { storeData, categories } = useLayout();
  console.log("Home categories", categories);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-4 lg:p-6">
        <TabNavigation currentTab="home" storeData={storeData} />

        <CategoriesList
          categories={categories?.data || []}
          storeData={storeData}
        />
      </div>
    </div>
  );
}
