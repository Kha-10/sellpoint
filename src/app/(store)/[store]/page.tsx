import { getStoreData } from "@/lib/api";
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

  // Pass storeData to the client component
  return <HomeClient storeData={storeData} />;
}
