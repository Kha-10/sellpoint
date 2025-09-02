"use client";

import { useState } from "react";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/app/(store)/[store]/components/sidebar";
import TopNav from "@/app/(store)/[store]/components/TopNav";
import TabNavigation from "@/app/(store)/[store]/components/TabNavigation";
import { StoreData } from "@/lib/api";

export default function SearchPage({ storeData }: { storeData: StoreData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const foodItems = [
    { id: 1, name: "Mont te (Copy) (Copy) (Copy)", price: "$20.00" },
    { id: 2, name: "Mont te (Copy) (Copy)", price: "$20.00" },
    { id: 3, name: "Mont te (Copy) (Copy) (Copy)", price: "$20.00" },
    { id: 4, name: "Mont te (Copy)", price: "$20.00" },
    { id: 5, name: "Mont te (Copy) (Copy) (Copy)", price: "$20.00" },
    { id: 6, name: "Mont te (Copy) (Copy) (Copy)", price: "$20.00" },
    { id: 7, name: "Mont te (Copy) (Copy)", price: "$20.00" },
    { id: 8, name: "Mont te (Copy) (Copy) (Copy)", price: "$20.00" },
    { id: 9, name: "Mont te (Copy)", price: "$20.00" },
    { id: 10, name: "Mont te (Copy) (Copy) (Copy)", price: "$20.00" },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

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
        />

        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-4 lg:p-6">
            <TabNavigation currentTab="search" storeData={storeData} />

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-64 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 lg:flex-col lg:gap-6">
                  <div className="flex-1 lg:hidden">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="latest">Latest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name</option>
                    </select>
                  </div>

                  <div className="flex-1 lg:flex-none bg-white rounded-lg border border-gray-200 p-3 lg:p-4">
                    <div
                      className="flex items-center justify-between mb-2 lg:mb-3 cursor-pointer"
                      onClick={() => setCategoryOpen(!categoryOpen)}
                    >
                      <h3 className="text-sm font-medium text-gray-900">
                        Category
                      </h3>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          categoryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {categoryOpen && (
                      <div className="space-y-1 lg:space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes("food")}
                            onChange={() => handleCategoryChange("food")}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Food
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes("myanmar")}
                            onChange={() => handleCategoryChange("myanmar")}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            ထမင်းဝင်း
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="hidden lg:flex justify-end mb-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {foodItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/food/${item.id}`}
                      className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors group"
                    >
                      <div className="aspect-square flex items-center justify-center mb-3">
                        <ShoppingCart className="h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}