import { getStoreData } from "@/lib/api";
import type { Metadata } from "next";
import Checkout from "./checkout";

interface PageProps {
  params: Promise<{ store: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { store } = await params;
  const storeData = await getStoreData(store);

  if (!storeData) {
    return {
      title: "Checkout - Store Not Found",
      description:
        "This store could not be found. Please check the URL or visit our homepage.",
    };
  }

  return {
    title: `Checkout – ${storeData.name} | Sell Point`,
    description: `Complete your purchase securely at ${storeData.name}.`,
    openGraph: {
      title: `Checkout at ${storeData.name}`,
      description: `Shop and checkout securely at ${storeData.name}.`,
      url: `${process.env.NEXT_DOMAIN}/${storeData.slug}/checkout`,
    },
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { store } = await params;
  const storeData = await getStoreData(store);

  if (!storeData) return <h1>Store Not Found</h1>;

  return <Checkout storeData={storeData} />;
}
