"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/app/(store)/[store]/components/sidebar";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData } from "@/lib/api";
import axios from "@/helper/axios";
import { Category } from "@/lib/api";
import Link from "next/link";

export default function HomeClient({ storeData }: { storeData: StoreData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllFood, setShowAllFood] = useState(false);
  const [products, setProducts] = useState<Category[]>([]);

  const displayedItems = showAllFood ? products : products.slice(0, 10);

  const navigateToFoodCategory = (id: string): void => {
    window.location.href = `/${storeData?.slug}/category/${id}`;
  };

  //   const navigateToSearch = () => {
  //     window.location.href = "/search";
  //   };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = true;
        const res = await axios.get<{ data: Category[] }>(
          `/api/stores/${storeData._id}/categories?${all ? "all=true" : ""}`
        );
        setProducts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    if (storeData._id) {
      fetchProducts();
    }
  }, [storeData._id]);

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
            <TabNavigation currentTab="home" />

            <div className="space-y-6">
              {displayedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-2xl mx-auto mb-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Link
                      href={`/${storeData?.slug}/category/${item._id}`}
                      className="text-lg font-semibold text-gray-900"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {item.products?.length || 0} items
                    </span>
                  </div>

                  {/* Product list (first 5 items) */}
                  <div className="space-y-3">
                    {item.products?.slice(0, 5).map((product) => (
                      <Link
                        href={`/${storeData?.slug}/product/${product._id}`}
                        key={product._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Show all / show less button */}
                  {!!item.products && item.products.length > 5 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={
                          !!item.products && item.products.length > 5
                            ? () => setShowAllFood(false)
                            : () => navigateToFoodCategory(item._id)
                        }
                        className="w-full text-sm bg-white border border-gray-200 text-accent-foreground hover:bg-gray-50"
                      >
                        {item.products &&
                          item.products.length > 5 &&
                          `View All Products (${item.products?.length || 0})`}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
