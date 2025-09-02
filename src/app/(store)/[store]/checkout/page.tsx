import { getStoreData } from "@/lib/api";

export default async function Home({
    params,
  }: {
    params: Promise<{ store: string }>;
  }) {
    const { store } = await params;
    const storeData = await getStoreData(store);
  
    return (
      <div>
        CHeckout
      </div>
    );
}