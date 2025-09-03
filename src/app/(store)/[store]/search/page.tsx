import { getStoreData, getProducts } from "@/lib/api";
import SearchPage from "../components/search";
import { notFound } from "next/navigation";

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
