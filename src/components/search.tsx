"use client";

import TabNavigation from "@/components/TabNavigation";
import { Product, ProductsAPIResponse } from "@/lib/api";
import SearchList from "./SearchList";
import Pagination from "./Pagination";
import { useLayout } from "../app/contexts/LayoutContext";

interface SearchPageProps {
  products: Product[];
  pagination: ProductsAPIResponse["pagination"];
}

export default function SearchPage({ products, pagination }: SearchPageProps) {
  const { storeData } = useLayout();

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 p-4 lg:p-6">
        <TabNavigation currentTab="search" storeData={storeData} />
        <SearchList products={products} />
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-3 lg:px-6">
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 10}
        />
      </div>
    </div>
  );
}
