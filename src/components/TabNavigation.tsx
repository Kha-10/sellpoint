import Link from "next/link";

interface TabNavigationProps {
  currentTab: "home" | "search";
}

export default function TabNavigation({
  currentTab,
}: TabNavigationProps) {
  
  return (
    <div className="flex justify-center mb-6">
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Link
          href={`/`}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            currentTab === "home"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Home
        </Link>
        <Link
          href={`/search?page=1&limit=10&sortBy=createdAt&sortDirection=desc`}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            currentTab === "search"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Search
        </Link>
      </div>
    </div>
  );
}
