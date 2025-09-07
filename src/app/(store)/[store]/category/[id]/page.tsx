import ProductList from "../../components/ProductList";
import { getSingleCategoryData } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string; store: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, store } = await params;
  const categoryData = await getSingleCategoryData(id, store);

  return (
    <div className="flex flex-col h-screen bg-white px-5">
      <div className="flex items-center p-4 space-x-3">
        <Link href={`/${store}`}>
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <p className="text-lg font-bold">{categoryData?.name}</p>
      </div>
      <div className="flex-1 p-4 lg:p-6">
        <ProductList products={categoryData?.products || []} />
      </div>
      {/* <div className="border-t border-gray-200 bg-white px-4 py-3 lg:px-6">
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 10}
        />
      </div> */}
    </div>
  );
}
