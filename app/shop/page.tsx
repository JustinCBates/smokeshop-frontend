import { getCloverShopProducts } from "@/lib/clover/inventory";
import type { ShopProductRecord } from "@/lib/clover/inventory";
import { siteConfig } from "@/lib/site-config";
import { ShopContent } from "./shop-content";
import type { Metadata } from "next";

// Force dynamic rendering since we query database
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: `Browse our full catalog of premium products at ${siteConfig.name}.`,
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;

  let products: ShopProductRecord[] = [];

  try {
    const cloverProducts = await getCloverShopProducts({
      category: params.category,
      search: params.q,
    });
    if (cloverProducts) {
      products = cloverProducts;
    }
  } catch (error) {
    console.error("Failed to fetch Clover inventory:", error);
  }

  const regions: any[] = [];
  const pickupLocations: any[] = [];
  const regionInventory: any[] = [];
  const pickupInventory: any[] = [];

  return (
    <ShopContent
      products={products ?? []}
      regions={regions ?? []}
      pickupLocations={pickupLocations ?? []}
      regionInventory={regionInventory ?? []}
      pickupInventory={pickupInventory ?? []}
      initialCategory={params.category ?? ""}
      initialSearch={params.q ?? ""}
    />
  );
}
