import { Product } from "@/app/(store)/[store]/providers/CartContext";

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
