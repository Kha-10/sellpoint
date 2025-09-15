import { getSingleProductData, getStoreData, StoreData } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDetail from "@/components/ProductDetail";
import { Metadata } from "next";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string;}>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];

  const storeData = await getStoreData(subdomain);

  if (!storeData) {
    return {
      title: "Product - Store Not Found",
      description:
        "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  const productData = await getSingleProductData(id, subdomain);

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
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);
  const { data: product, error } = await getSingleProductData(id, subdomain);

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href={'/'}>Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  return <ProductDetail storeData={storeData as StoreData} product={product} />;
}
