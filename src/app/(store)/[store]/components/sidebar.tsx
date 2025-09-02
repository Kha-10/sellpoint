"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Share, Globe, Plus, X } from "lucide-react";
import Link from "next/link";
import { StoreData } from "@/lib/api";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  storeData: StoreData;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  storeData,
}: SidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
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
          <div className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
            <Link href={`/${storeData?.slug}`} className="text-sm font-medium">
              Home
            </Link>
          </div>

          <div className="space-y-2">
            <div
              className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer"
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
              <div className="ml-4 space-y-2">
                <Link
                  href="/food"
                  className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 block"
                >
                  Food
                </Link>
                <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  ထမင်းဝင်း
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">Add to Home Screen</span>
          </div>

          <div className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
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
            className="w-full justify-start text-sm bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create your SellPoint App
          </Button>
        </div>
      </div>
    </>
  );
}
