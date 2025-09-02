import { getStoreData, getProducts, getCateogryData } from "@/lib/api";
import SearchPage from "../components/search";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;
  const storeData = await getStoreData(store);
  if (!storeData) notFound();
  const products = await getProducts({
    slug: storeData.slug,
    page: 1,
    categories: [],
    visibility: "visible",
    sortBy: "createdAt",
    sortDirection: "asc",
    searchQuery: "",
  });

  const categories = await getCateogryData(storeData.slug);
  console.log("categories from search", categories);
  
  return (
    <>
      <SearchPage
        storeData={storeData}
        products={products ?.data || []}
        categories={categories?.data || []}
        pagination={products?.pagination}
      />
    </>
  );
}
