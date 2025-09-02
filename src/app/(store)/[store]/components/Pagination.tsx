"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  className?: string
}

export default function Pagination({ currentPage, totalPages, className = "" }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
     console.log("page", `${pathname}?${params.toString()}`);
    router.push(`${pathname}?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }
  console.log("currentPage",currentPage);
  
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center cursor-pointer px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => (typeof page === "number" ? updatePage(page) : null)}
            disabled={typeof page !== "number"}
            className={`px-3 cursor-pointer py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? "bg-primary text-white"
                : typeof page === "number"
                  ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  : "text-gray-400 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => updatePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center cursor-pointer px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  )
}