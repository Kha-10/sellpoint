"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Product } from "@/lib/api";
import FilterSidebar from "./FilterSidebar";
import FilterSheet from "./FIlterSheet";
import { useMobile } from "@/app/hooks/useMobile";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import ProductList from "./ProductList";
import { useLayout } from "../contexts/LayoutContext";

const SearchList = ({ products }: { products: Product[] }) => {
  const { categories } = useLayout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  // const [sortBy, setSortBy] = useState("latest");
  const isMobile = useMobile();
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL without full page reload
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("searchQuery", value);
    } else {
      params.delete("searchQuery");
    }

    router.replace(`?${params.toString()}`);
  };

  console.log(isMobile);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-64 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleChange}
            className="bg-background shadow-sm w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-0 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 md:flex-col md:gap-6">
          {/* <div className="flex-1 md:hidden">
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
          </div> */}

          {!isMobile && (
            <div className="w-64 flex-shrink-0">
              <FilterSidebar categories={categories?.data} />
            </div>
          )}
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1">
        {/* <div className="hidden md:flex justify-end mb-4">
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
        </div> */}

        {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((item) => (
            <Link
              key={item._id}
              href={`/product/${item._id}`}
              className="bg-background rounded-lg p-4 hover:bg-gray-100 transition-colors group border border-gray-200"
            >
              <div className="aspect-square flex items-center justify-center mb-3">
                <ShoppingCart className="h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {item.name}
                </h3>
                <div className="text-sm text-primary">
                  {formatWithCurrency(
                    item.price !== 0
                      ? item.price
                      : item.variants && item.variants.length > 0
                      ? item.variants[0].price
                      : 0,
                    storeData?.settings?.currency
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div> */}
        <ProductList products={products}/>
      </div>
      {/* Mobile Filter Sheet */}
      {isMobile && (
        <FilterSheet
          categories={categories?.data}
          open={showFilters}
          onOpenChange={setShowFilters}
        />
      )}
    </div>
  );
};

export default SearchList;
