import type { Metadata } from "next";
import "./global.css";
import Header from "@/app/(main)/components/Header";
import Footer from "@/app/(main)/components/Footer";

export const metadata: Metadata = {
  title: "Nexora Digital",
  description: "Power Your Business with Your Own Online Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
