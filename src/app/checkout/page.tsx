import { getStoreData } from "@/lib/api";
import Checkout from "./checkout";
import { headers } from "next/headers";

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);

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

export default async function CheckoutPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);
  console.log(storeData);

  if (!storeData) return <h1>Store Not Found</h1>;

  return <Checkout storeData={storeData} />;
}
