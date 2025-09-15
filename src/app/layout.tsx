import "../app/globals.css";
import { getStoreData, getCategoryData } from "@/./lib/api";
import { LayoutProvider } from "@/app/contexts/LayoutContext";
import NavigationLayout from "@/components/NavigationLayout";
import { headers } from "next/headers";

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];
  const storeData = await getStoreData(subdomain);

  if (!storeData) {
    return {
      title: "Store Not Found",
      description: "Browse our products online.",
    };
  }

  return {
    title: `${storeData.name} | Sell Point`,
    openGraph: {
      title: `Shop at ${storeData.name} – Browse Products Online`,
      description: `Explore at ${storeData.name} online.`,
      url: `${process.env.NEXT_DOMAIN}/${storeData.slug}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts[0];

  const [storeData, categories] = await Promise.all([
    getStoreData(subdomain),
    getStoreData(subdomain).then((data) =>
      data ? getCategoryData(data.slug) : null
    ),
  ]);

  if (!storeData || !categories) {
    return (
      <html lang="en">
        <body>
          <p>Store not found</p>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <LayoutProvider storeData={storeData} categories={categories}>
          <NavigationLayout>{children}</NavigationLayout>
        </LayoutProvider>
      </body>
    </html>
  );
}
