import type { Metadata } from "next";
import "../../../app/globals.css";
import { getStoreData } from "@/./lib/api";
import { CartProvider } from "@/app/(store)/[store]/providers/CartContext";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string }> ;
}): Promise<Metadata> {
  const { store } = await params; 
  const storeData = await getStoreData(store);

  if (!storeData) {
    return {
      title: "Store Not Found",
      description: "Browse our products online.",
    };
  }

  return {
    title: `${storeData.name}`,
    openGraph: {
      title: storeData.name,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }> 
}) {
  const { store } = await params; 
  const storeData = await getStoreData(store);
  console.log("storeData", storeData);

  if (!storeData) notFound();

  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
