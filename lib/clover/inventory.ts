import "server-only";
import { mockItems } from "@/lib/clover/mocks";
import type { CloverItem } from "@/lib/clover/types";

type CloverItemsResponse = {
  elements?: CloverItem[];
};

export interface ShopProductRecord {
  sku: string;
  product_name: string;
  product_description: string | null;
  image_url: string;
  category: string;
  price_in_cents: number;
  in_stock: boolean;
  delivery_eligible: boolean;
  featured: boolean;
}

function inferCategoryFromSku(sku: string): string {
  const upper = sku.toUpperCase();

  if (upper.startsWith("GLASS-")) return "glass-pipes-bongs";
  if (upper.startsWith("VAPE-")) return "vapes-e-cigarettes";
  if (upper.startsWith("ROLL-")) return "rolling-papers-wraps";
  if (upper.startsWith("ACC-")) return "accessories";
  if (upper.startsWith("CBD-") || upper.startsWith("DELTA-"))
    return "cbd-delta-products";
  if (upper.startsWith("CANN-")) return "cannabis-flower";

  return "accessories";
}

function toShopProduct(item: CloverItem): ShopProductRecord {
  const sku = (item.code || item.id || "").toUpperCase().trim();
  const stockCount = Number(item.stockCount ?? item.quantity);
  const hasStockCount = Number.isFinite(stockCount);
  const inStock = item.hidden ? false : hasStockCount ? stockCount > 0 : true;
  const priceInCents = Number.isFinite(Number(item.price))
    ? Number(item.price)
    : 0;

  return {
    sku,
    product_name: item.name?.trim() || sku || "Unnamed product",
    product_description: item.description?.trim() || null,
    image_url: sku
      ? `/api/product-image/${sku}`
      : "/images/products/placeholder.svg",
    category: inferCategoryFromSku(sku),
    price_in_cents: priceInCents,
    in_stock: inStock,
    delivery_eligible: true,
    featured: false,
  };
}

export async function getCloverShopProducts(params: {
  category?: string;
  search?: string;
}): Promise<ShopProductRecord[] | null> {
  if (process.env.CLOVER_USE_MOCKS === "true") {
    let mockProducts = mockItems.map(toShopProduct);

    if (params.category) {
      mockProducts = mockProducts.filter(
        (product) => product.category === params.category,
      );
    }

    if (params.search) {
      const needle = params.search.toLowerCase();
      mockProducts = mockProducts.filter((product) =>
        product.product_name.toLowerCase().includes(needle),
      );
    }

    mockProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
    return mockProducts;
  }

  const accessToken = process.env.CLOVER_ACCESS_TOKEN;
  const merchantId = process.env.CLOVER_MERCHANT_ID;
  const baseUrl =
    process.env.CLOVER_API_BASE_URL || "https://apisandbox.dev.clover.com";

  if (!accessToken || !merchantId) {
    return null;
  }

  const url = `${baseUrl}/v3/merchants/${merchantId}/items?limit=1000`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Clover items request failed (${response.status}): ${details}`,
    );
  }

  const payload = (await response.json()) as CloverItemsResponse;
  const items = payload.elements || [];

  let products = items
    .map(toShopProduct)
    .filter((product) => Boolean(product.sku) && Boolean(product.product_name));

  if (params.category) {
    products = products.filter(
      (product) => product.category === params.category,
    );
  }

  if (params.search) {
    const needle = params.search.toLowerCase();
    products = products.filter((product) =>
      product.product_name.toLowerCase().includes(needle),
    );
  }

  products.sort((a, b) => a.product_name.localeCompare(b.product_name));
  return products;
}
