import { query } from "@/lib/database/client";
import { getCloverShopProducts } from "@/lib/clover/inventory";
import {
  getActivePickupLocations,
  getActiveRegions,
  getPickupInventory,
  getRegionInventory,
} from "@/lib/database/public-data";
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

  let products = [];

  try {
    const cloverProducts = await getCloverShopProducts({
      category: params.category,
      search: params.q,
    });
    if (cloverProducts) {
      products = cloverProducts;
    }
  } catch (error) {
    console.error(
      "Failed to fetch Clover inventory, falling back to PostgreSQL:",
      error,
    );
  }

  if (!products.length) {
    // Fallback to PostgreSQL products when Clover inventory is unavailable.
    let productQuery = `
      SELECT 
        sku,
        name as product_name,
        description as product_description,
        ('/api/product-image/' || sku) as image_url,
        category,
        (price * 100)::integer as price_in_cents,
        in_stock,
        true as delivery_eligible,
        false as featured
      FROM products
      WHERE 1=1
    `;
    const queryParams: Array<string> = [];
    let paramIndex = 1;

    if (params.category) {
      productQuery += ` AND category = $${paramIndex}`;
      queryParams.push(params.category);
      paramIndex++;
    }

    if (params.q) {
      productQuery += ` AND name ILIKE $${paramIndex}`;
      queryParams.push(`%${params.q}%`);
      paramIndex++;
    }

    productQuery += ` ORDER BY name`;

    try {
      products = await query(productQuery, queryParams);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      products = [];
    }
  }

  const [regions, pickupLocations, regionInventory, pickupInventory] =
    await Promise.all([
      getActiveRegions(),
      getActivePickupLocations(),
      getRegionInventory(),
      getPickupInventory(),
    ]);

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
