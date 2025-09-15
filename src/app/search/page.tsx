import { getStoreData, getProducts } from "@/lib/api";
import SearchPage from "@/components/search";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);

  if (!storeData) {
    return {
      title: "Search - Store Not Found",
      description:
        "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  return {
    title: `search - ${storeData.name} | Sell Point`,
    openGraph: {
      title: `Shop at ${storeData.name} | Browse Products Online`,
      description: `Explore products at ${storeData.name} online.`,
      url: `${process.env.NEXT_DOMAIN}/${storeData.slug}`,
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: number;
    category?: string;
    searchQuery?: string;
  }>;
}) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];

  const resolvedSearch = await searchParams;
  const storeData = await getStoreData(subdomain);
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
