interface StoreSettings {
  payments: object;
  shipping: object;
  theme: { color: string; font: string };
  notifications: object;
  currency: string;
  timezone: string;
  language: string;
}

export interface StoreData {
  _id: string;
  name: string;
  phone: string;
  address: string;
  slug: string;
  settings: StoreSettings;
  isActive: boolean;
  membershipType: string;
  membershipExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  visibility: "visible" | "hidden";
  description?: string;
  orderIndex: number;
  products: Product[];
  storeId: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  data: Category[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    totalCategories: number;
    totalPages: number | null;
  };
}

export interface Inventory {
  _id: string;
  quantity: number;
}

export interface FlexibleOptionItem {
  name?: string; // not marked required in schema
  amount?: number; // defaults to 0
}

export type OptionType = "Checkbox" | "Selection" | "Number" | "Text";

export interface OptionSettings {
  min?: number;
  max?: number;
  inputType?: string;
  enableQuantity?: boolean;
  choices?: FlexibleOptionItem[];
}

export interface Option {
  name: string;
  type: OptionType;
  required?: boolean; // default false
  value?: string; // default ""
  settings?: OptionSettings;
}

export interface Variant {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number; // default 0
}

export type ProductType = "physical" | "digital" | "service";

export interface Product {
  _id: string;
  name: string;
  visibility?: string; // default "visible"
  categories?: string[]; // refs Category
  type: ProductType;
  price: number;
  originalPrice?: number; // default 0
  description?: string;
  photo?: string[];
  imgUrls?: string[];
  variants?: Variant[];
  options?: Option[];
  trackQuantityEnabled?: boolean;
  inventory?: Inventory;
  dailyCapacity?: boolean;
  cartMaximumEnabled?: boolean;
  cartMaximum?: number;
  cartMinimumEnabled?: boolean;
  cartMinimum?: number;
  sku?: string;
  storeId?: string; // ref Store
  createdBy?: string; // ref User
  updatedBy?: string; // ref User
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductsAPIResponse {
  data: Product[];
  pagination?: {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    totalCategories: number;
    totalPages: number | null;
  };
}

interface GetProductsParams {
  slug: string;
  page?: number;
  pageSize?: number;
  categories?: string[];
  visibility?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  searchQuery?: string;
}

export async function getStoreData(
  storeSlug: string
): Promise<StoreData | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/stores/${storeSlug}`, {
      cache: "no-store", // avoid stale cache in dev
    });

    if (!res.ok) return null;

    return res.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("getStoreData error:", err.message);
    } else {
      console.error("getStoreData unknown error:", err);
    }
    return null;
  }
}

export async function getCateogryData(
  slug: string
): Promise<CategoryResponse | null> {
  try {
    const all = true;
    console.log(slug);

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/public/stores/${slug}/categories?${all ? "all=true" : ""}`
    );
    const response: CategoryResponse = await res.json();
    console.log("API response:", response);

    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("getCateogryData error:", err.message);
    } else {
      console.error("getCateogryData unknown error:", err);
    }
    return null;
  }
}

export async function getProducts({
  slug,
  page = 1,
  categories,
  visibility,
  sortBy = "latest",
  sortDirection = "asc",
  searchQuery,
}: GetProductsParams): Promise<ProductsAPIResponse | null> {
  try {
    console.log(slug);
    const url = `/api/public/stores/${slug}/products?page=${page}}${
      categories ? `&categories=${categories}` : ""
    }${
      visibility ? `&visibility=${visibility}` : ""
    }&sortBy=${sortBy}&sortDirection=${sortDirection}${
      searchQuery ? `&search=${searchQuery}` : ""
    }`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
    const response: ProductsAPIResponse = await res.json();
    console.log("API response:", response);

    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("getProducts error:", err.message);
    } else {
      console.error("getProducts unknown error:", err);
    }
    return null;
  }
}
