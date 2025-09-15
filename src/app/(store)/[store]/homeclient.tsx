"use client";
import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData,CategoryResponse } from "@/lib/api";
import CategoriesList from "./components/CategoriesList";

interface HomeClientProps {
  storeData: StoreData;
  categories: CategoryResponse;
}

export default function HomeClient({ storeData, categories }: HomeClientProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-4 lg:p-6">
        <TabNavigation currentTab="home" storeData={storeData} />

        <CategoriesList categories={categories?.data || []} storeData={storeData} />
      </div>
    </div>
  );
}
