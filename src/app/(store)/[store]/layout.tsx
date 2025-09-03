import type { Metadata } from "next";
import "../../../app/globals.css";
import { getStoreData, getCategoryData } from "@/./lib/api";
import { CartProvider } from "@/app/(store)/[store]/providers/CartContext";
import { notFound } from "next/navigation";
import { LayoutProvider } from "@/app/(store)/[store]/contexts/LayoutContext";
import NavigationLayout from "@/app/(store)/[store]/components/NavigationLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string }>;
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
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;

  const [storeData, categories] = await Promise.all([
    getStoreData(store),
    getStoreData(store).then((data) =>
      data ? getCategoryData(data.slug) : null
    ),
  ]);

  if (!storeData || !categories) notFound();

  return (
    <html lang="en">
      <body>
        {/* <CartProvider>
          {children}
        </CartProvider> */}
        <LayoutProvider storeData={storeData} categories={categories}>
          <CartProvider>
            <NavigationLayout>{children}</NavigationLayout>
          </CartProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
