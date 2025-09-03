import { getSingleProductData,getStoreData, StoreData } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDetail from "../../components/ProductDetail";

interface PageProps {
  params: Promise<{ id: string; store: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, store } = await params;
  const storeData = await getStoreData(store);
  const { data: product, error } = await getSingleProductData(id, store);

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href={`/${store}`}>Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  return <ProductDetail storeData={storeData as StoreData} product ={product} />;
}
