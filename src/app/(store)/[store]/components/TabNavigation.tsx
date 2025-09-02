import Link from "next/link";
import { StoreData } from "@/lib/api";

interface TabNavigationProps {
  currentTab: "home" | "search";
  storeData: StoreData;
}

export default function TabNavigation({
  currentTab,
  storeData,
}: TabNavigationProps) {
  console.log("storeData",storeData);
  
  return (
    <div className="flex justify-center mb-6">
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Link
          href={`/${storeData?.slug}`}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            currentTab === "home"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Home
        </Link>
        <Link
          href={`/${storeData?.slug}/search`}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            currentTab === "search"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Search
        </Link>
      </div>
    </div>
  );
}
