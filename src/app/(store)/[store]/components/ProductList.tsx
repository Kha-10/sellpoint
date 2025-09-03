"use client";

import { Product } from "@/lib/api";
import Link from "next/link";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { ShoppingCart } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";

const ProductList = ({ products }: { products: Product[] }) => {
  const { storeData } = useLayout();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((item) => (
        <Link
          key={item._id}
          href={`/${storeData?.slug}/product/${item._id}`}
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
    </div>
  );
};

export default ProductList;
