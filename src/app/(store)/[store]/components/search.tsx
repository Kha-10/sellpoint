"use client";

import { useState } from "react";
import Sidebar from "@/app/(store)/[store]/components/sidebar";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData, Product, Category, ProductsAPIResponse } from "@/lib/api";
import ProductList from "./ProductList";
import Pagination from "./Pagination";

interface SearchPageProps {
  storeData: StoreData;
  products: Product[];
  categories: Category[];
  pagination: ProductsAPIResponse["pagination"];
}

export default function SearchPage({
  storeData,
  products,
  categories,
  pagination,
}: SearchPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log("categoriesSearchPage", categories);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNav
        setSidebarOpen={setSidebarOpen}
        currentPage="search"
        storeData={storeData}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          storeData={storeData}
          categories={categories}
        />

        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-4 lg:p-6">
            <TabNavigation currentTab="search" storeData={storeData} />
            <ProductList
              storeData={storeData}
              products={products}
              categories={categories}
            />
          </div>
          <div className="border-t border-gray-200 bg-white px-4 py-3 lg:px-6">
            <Pagination
              currentPage={pagination?.currentPage || 1}
              totalPages={pagination?.totalPages || 10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
