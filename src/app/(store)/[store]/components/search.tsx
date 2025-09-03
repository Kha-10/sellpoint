"use client";

import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData, Product, ProductsAPIResponse } from "@/lib/api";
import ProductList from "./ProductList";
import Pagination from "./Pagination";
import { useLayout } from "../contexts/LayoutContext";

interface SearchPageProps {
  storeData: StoreData;
  products: Product[];
  pagination: ProductsAPIResponse["pagination"];
}

export default function SearchPage({
  storeData,
  products,
  pagination,
}: SearchPageProps) {
   const { categories } = useLayout();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-4 lg:p-6">
        <TabNavigation currentTab="search" storeData={storeData} />
        <ProductList
          storeData={storeData}
          products={products}
          categories={categories?.data}
        />
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
