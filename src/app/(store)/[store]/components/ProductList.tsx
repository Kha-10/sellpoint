"use client";

import { Product } from "@/lib/api";
import Link from "next/link";
import { formatWithCurrency } from "@/helper/formatCurrency";
import { ShoppingCart } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";
import Image from "next/image";

const ProductList = ({ products }: { products: Product[] }) => {
  const { storeData } = useLayout();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((item) => (
        <Link
          key={item._id}
          href={`/${storeData?.slug}/product/${item._id}`}
          className="bg-background shadow-sm rounded-lg p-4 hover:bg-gray-100 transition-colors group border border-gray-200"
        >
          {(item?.imgUrls?.length ?? 0) > 0 && (
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-background to-secondary/30">
              <Image
                priority
                width={400}
                height={400}
                src={item?.imgUrls![0]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {item?.imgUrls?.length === 0 && (
            <div className="aspect-square flex items-center justify-center mb-3">
              <ShoppingCart className="h-12 w-12 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          )}
          <div className="text-center">
            <h3 className="text-sm font-medium font-serif  text-gray-900 line-clamp-2 mb-2">
              {item.name}
            </h3>
            <div className="text-primary text-sm">
              {formatWithCurrency(
                item.price ?? item.originalPrice ?? 0,
                storeData?.settings?.currency ?? "USD"
              )}
            </div>
            {item.price !== item.originalPrice && item.originalPrice! > 0 && (
              <div className="text-destructive line-through text-sm">
                {formatWithCurrency(
                  item.originalPrice!,
                  storeData?.settings?.currency ?? "USD"
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
