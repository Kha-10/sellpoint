import { getStoreData, getProducts, getCateogryData } from "@/lib/api";
import SearchPage from "../components/search";
import { notFound } from "next/navigation";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams?: Promise<{
    page?: number;
    categories?: string;
    searchQuery?: string;
  }>;
}) {
  const { store } = await params;
  const resolvedSearch = await searchParams;
  const storeData = await getStoreData(store);
  if (!storeData) notFound();

  const page = Number(resolvedSearch?.page) || 1;
  const categoriesFromParams = resolvedSearch?.categories?.split(",") || [];
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

  const categories = await getCateogryData(storeData.slug);
  console.log("products", products);

  return (
    <>
      <SearchPage
        storeData={storeData}
        products={products?.data || []}
        categories={categories?.data || []}
        pagination={products?.pagination}
      />
    </>
  );
}
