"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Share, Plus, X } from "lucide-react";
import Link from "next/link";
import { StoreData, CategoryResponse } from "@/lib/api";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  storeData: StoreData;
  categories: CategoryResponse;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  storeData,
  categories,
}: SidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  console.log("categories", categories);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:mt-0
      `}
      >
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1">
          <div className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer hover:bg-gray-100 p-2 rounded-md ">
            <Link href={`/${storeData?.slug}`} className="text-sm font-medium">
              Home
            </Link>
          </div>

          <div className="space-y-2">
            <div
              className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer hover:bg-gray-100 p-2 rounded-md "
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <span className="text-sm font-medium">Category</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {categoryOpen && (
              // <div className="ml-4 space-y-2">
              //   <Link
              //     href={`/${storeData?.slug}/category/${categories[0]?.slug}`}
              //     className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 block"
              //   >
              //     Food
              //   </Link>
              //   <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
              //     ထမင်းဝင်း
              //   </div>
              // </div>
              <div className="ml-4 space-y-0">
                {categories.data?.length > 0 &&
                  categories.data.map((category) => (
                    <Link
                      key={category._id}
                      href={`/${storeData?.slug}/category/${category._id}`}
                      className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 block hover:bg-gray-100 p-2 rounded-md "
                    >
                      {category.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <div className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2 hover:rounded-md cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Add to Home Screen</span>
          </div>

          <div className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
            <Share className="h-4 w-4 mr-2" />
            <span className="text-sm">Share</span>
          </div>

          {/* <div className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-sm">English</span>
            <ChevronDown className="h-4 w-4 ml-auto" />
          </div> */}
        </div>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-sm bg-transparent hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create your SellPoint App
          </Button>
        </div>
      </div>
    </>
  );
}
