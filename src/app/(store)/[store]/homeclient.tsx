"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/app/(store)/[store]/components/sidebar";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData } from "@/lib/api";
import axios from "@/helper/axios";
import {Product} from "@/app/(store)/[store]/providers/CartContext"


export default function HomeClient({ storeData }: { storeData: StoreData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllFood, setShowAllFood] = useState(false);
  const [products, setProducts] = useState <Product[]> ([]);

  const displayedItems = showAllFood ? products : products.slice(0, 10);
  const hasMoreItems = products.length > 5;

  const navigateToFoodCategory = () => {
    window.location.href = "/food";
  };

//   const navigateToSearch = () => {
//     window.location.href = "/search";
//   };

  const fetchProducts = async () => {
    const all = true
    const res = await axios.get(
      `/api/stores/${storeData._id}/products?${all === true ? "all=true" : ""}`
    );
    console.log("res", res);
    setProducts(res.data?.data)
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNav
        setSidebarOpen={setSidebarOpen}
        currentPage="home"
        storeData={storeData}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} storeData={storeData} />

        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-4 lg:p-6">
            <TabNavigation currentTab="home" />

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Food</h2>
                  <span className="text-sm text-gray-500">
                    {products.length} items
                  </span>
                </div>

                <div className="space-y-3">
                  {displayedItems.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreItems && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={
                        showAllFood
                          ? () => setShowAllFood(false)
                          : navigateToFoodCategory
                      }
                      className="w-full text-sm"
                    >
                      {showAllFood
                        ? "Show Less"
                        : `View All Products (${products.length})`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
