import { getStoreData } from "@/lib/api";
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

  return (
    <>
      <SearchPage storeData={storeData} />
    </>
  );
}
