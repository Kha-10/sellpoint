"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StoreData, Category } from "@/lib/api";

interface CategoriesListProps {
  categories: Category[];
  storeData: StoreData;
}

export default function CategoriesList({
  categories,
  storeData,
}: CategoriesListProps) {
  const navigateToFoodCategory = (id: string): void => {
    window.location.href = `/${storeData?.slug}/category/${id}`;
  };
  console.log("storeData", storeData);

  return (
    <div className="space-y-6">
      {categories.length > 0 &&
        categories.map((item) => (
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

            <div className="space-y-3">
              {item.products?.slice(0, 5).map((product) => (
                <Link
                  href={`/${storeData?.slug}/product/${product._id}`}
                  key={product._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-serif font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {storeData?.settings.currency} {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all button */}
            {!!item.products && item.products.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => navigateToFoodCategory(item._id)}
                  className="w-full text-sm bg-white border border-gray-200 text-accent-foreground hover:bg-gray-50"
                >
                  View All Products ({item.products?.length || 0})
                </Button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
