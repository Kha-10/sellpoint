import { getStoreData, getProducts } from "@/lib/api";
import SearchPage from "../components/search";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string }>;
}): Promise<Metadata> {
  const { store } = await params;
  const storeData = await getStoreData(store);

  if (!storeData) {
    return {
      title: "Search - Store Not Found",
      description: "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  return {
    title: `search - ${storeData.name} | Sell Point`,
    openGraph: {
      title: `Shop at ${storeData.name} | Browse Products Online`,
      description: `Explore products at ${storeData.name} online.`,
      url: `${process.env.NEXT_DOMAIN }/${storeData.slug}`,
    },
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams?: Promise<{
    page?: number;
    category?: string;
    searchQuery?: string;
  }>;
}) {
  const { store } = await params;
  const resolvedSearch = await searchParams;
  const storeData = await getStoreData(store);
  if (!storeData) notFound();

  const page = Number(resolvedSearch?.page) || 1;
  const categoriesFromParams = resolvedSearch?.category?.split(",") || [];
  const searchQuery = resolvedSearch?.searchQuery || "";

  const products = await getProducts({
    slug: storeData.slug,
    page: page,
    categories: categoriesFromParams,
    visibility: "visible",
    sortBy: "createdAt",
    sortDirection: "asc",
    searchQuery: searchQuery,
  });
  return (
    <>
      <SearchPage
        products={products?.data || []}
        pagination={products?.pagination}
      />
    </>
  );
}
