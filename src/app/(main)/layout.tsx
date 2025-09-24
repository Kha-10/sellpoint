import type { Metadata } from "next";
import "./global.css";
import Header from "@/app/(main)/components/Header";
import Footer from "@/app/(main)/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Nexora Digital",
  description: "Power Your Business with Your Own Online Store",
  keywords: [
    "ecommerce platform",
    "online store builder",
    "white-label ecommerce",
    "ecommerce software",
  ],
  openGraph: {
    title: "Nexora Digital | E-Commerce Solutions",
    description: "Power Your Business with Your Own Online Store",
    url: "https://www.nexoradigital.site",
    siteName: "Nexora Digital",
    images: [
      {
        url: "/facebook.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora Digital | E-Commerce Solutions",
    description: "Power Your Business with Your Own Online Store",
    images: ["/twitter.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nexora Digital",
              url: "https://www.nexoradigital.site",
              logo: "/logo.png",
              description:
                "Nexora Digital helps businesses build their own branded online stores with secure, scalable, and modern e-commerce solutions.",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+660660611498",
                  contactType: "customer support",
                  areaServed: "Worldwide",
                  availableLanguage: ["en"],
                },
              ],
              sameAs: [
                "https://www.facebook.com/profile.php?id=61576106787710",
                // "https://www.linkedin.com/company/yourcompany",
                // "https://twitter.com/yourhandle",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
