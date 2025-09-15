import { getSingleProductData, getStoreData, StoreData } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDetail from "../../components/ProductDetail";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string; store: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { store, id } = await params;
  const storeData = await getStoreData(store);

  if (!storeData) {
    return {
      title: "Product - Store Not Found",
      description:
        "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  const productData = await getSingleProductData(id, store);

  return {
    title: `${productData?.data?.name} - ${storeData.name} | Sell Point`,
    openGraph: {
      title: `${productData?.data?.name} - ${storeData.name} | SellPoint`,
      description: `Explore ${productData?.data?.name} at ${storeData.name} online.`,
      url: `${process.env.NEXT_DOMAIN}/${storeData.slug}`,
    },
  };
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
  return <ProductDetail storeData={storeData as StoreData} product={product} />;
}
