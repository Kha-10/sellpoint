import ProductList from "../../components/ProductList";
import { getSingleCategoryData, getProducts, getStoreData } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Pagination from "../../components/Pagination";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string; store: string }>;
  searchParams?: Promise<{
    page?: number;
    category?: string;
    searchQuery?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { store, id } = await params;
  const storeData = await getStoreData(store);

  if (!storeData) {
    return {
      title: "Category - Store Not Found",
      description: "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  const categoryData = await getSingleCategoryData(id, store);

  return {
    title: `${categoryData?.name} - ${storeData.name} | Sell Point`,
    openGraph: {
      title: `${categoryData?.name} - ${storeData.name} | SellPoint`,
      description: `Explore ${categoryData?.name} at ${storeData.name} online.`,
      url: `${process.env.NEXT_DOMAIN}/${storeData.slug}`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id, store } = await params;
  const categoryData = await getSingleCategoryData(id, store);

  const resolvedSearch = await searchParams;
  const page = Number(resolvedSearch?.page) || 1;
  const searchQuery = resolvedSearch?.searchQuery || "";

  const products = await getProducts({
    slug: store,
    page: page,
    categories: [id],
    visibility: "visible",
    sortBy: "createdAt",
    sortDirection: "asc",
    searchQuery: searchQuery,
  });

  return (
    <div className="flex flex-col h-screen bg-white px-5">
      <div className="flex items-center p-4 space-x-3">
        <Button variant="ghost" asChild className=" hover:bg-gray-100">
          <Link href={`/${store}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Link>
        </Button>
        <p className="text-lg font-bold">{categoryData?.name}</p>
      </div>
      <div className="flex-1 p-4 lg:p-6">
        <ProductList products={categoryData?.products || []} />
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-3 lg:px-6">
        <Pagination
          currentPage={products?.pagination?.currentPage || 1}
          totalPages={products?.pagination?.totalPages || 10}
        />
      </div>
    </div>
  );
}
