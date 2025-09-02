import { getStoreData, getCateogryData } from "@/lib/api";
import HomeClient from "./homeclient";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;
  const storeData = await getStoreData(store);
  if (!storeData) notFound();
  console.log("storeData",storeData);
  
  const categories = await getCateogryData(storeData.slug);
  console.log("categories",categories?.data)
  return (
    <>
      <HomeClient storeData={storeData} categories={categories?.data || []} />
    </>
  );
}
