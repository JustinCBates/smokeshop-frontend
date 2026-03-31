import { getCloverShopProducts } from "@/lib/clover/inventory";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";
import { ProductDetail } from "./product-detail";
import type { Metadata } from "next";

// Force dynamic rendering since we query database
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ sku: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const products = (await getCloverShopProducts({})) ?? [];
  const data = products.find((p) => p.sku === sku.toUpperCase());

  return {
    title: data?.product_name ?? "Product",
    description: data?.product_description ?? siteConfig.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { sku } = await params;

  const products = (await getCloverShopProducts({})) ?? [];
  const product = products.find((p) => p.sku === sku.toUpperCase());
  if (!product) notFound();

  const regionInventory: Array<any> = [];
  const pickupInventory: Array<any> = [];
  const related = products
    .filter((p) => p.category === product.category && p.sku !== product.sku)
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      regionInventory={regionInventory ?? []}
      pickupInventory={pickupInventory ?? []}
      relatedProducts={related ?? []}
    />
  );
}
