import "server-only";
import { query } from "@/lib/database/client";

export interface RegionRecord {
  id: string;
  region_name: string;
  state: string;
  boundary: object;
  center_lat: number | null;
  center_lng: number | null;
}

export interface PickupLocationRecord {
  id: string;
  location_name: string;
  address: string;
  state: string;
  lat: number;
  lng: number;
}

export interface RegionInventoryRecord {
  sku: string;
  region_id: string;
  quantity: number;
}

export interface PickupInventoryRecord {
  sku: string;
  pickup_location_id: string;
  quantity: number;
}

export interface DeliveryFeeTierRecord {
  id: string;
  region_id: string;
  tier_name: string;
  description: string;
  fee_cents: number;
  estimated_minutes_min: number | null;
  estimated_minutes_max: number | null;
  sort_order: number;
}

interface OrderSummaryRecord {
  id: string;
  status: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  fulfillment_type: string;
  total_cents: number;
}

interface OrderItemRecord {
  sku: string | null;
  product_name: string;
  quantity: number;
  price_in_cents: number;
}

export async function getActiveRegions(): Promise<RegionRecord[]> {
  try {
    return await query<RegionRecord>(
      `
      SELECT
        id::text AS id,
        region_name,
        state,
        boundary,
        center_lat,
        center_lng
      FROM regions
      WHERE is_active = true
      ORDER BY region_name
      `,
    );
  } catch {
    return await query<RegionRecord>(
      `
      SELECT
        id::text AS id,
        name AS region_name,
        '' AS state,
        ST_AsGeoJSON(geometry)::jsonb AS boundary,
        ST_Y(ST_Centroid(geometry)) AS center_lat,
        ST_X(ST_Centroid(geometry)) AS center_lng
      FROM regions
      WHERE COALESCE(delivery_available, true) = true
      ORDER BY name
      `,
    );
  }
}

export async function getActivePickupLocations(): Promise<
  PickupLocationRecord[]
> {
  try {
    return await query<PickupLocationRecord>(
      `
      SELECT
        id::text AS id,
        location_name,
        address,
        state,
        lat,
        lng
      FROM pickup_locations
      WHERE is_active = true
      ORDER BY location_name
      `,
    );
  } catch {
    return await query<PickupLocationRecord>(
      `
      SELECT
        id::text AS id,
        name AS location_name,
        address,
        '' AS state,
        ST_Y(location) AS lat,
        ST_X(location) AS lng
      FROM pickup_locations
      WHERE COALESCE(is_active, true) = true
      ORDER BY name
      `,
    );
  }
}

export async function getRegionInventory(): Promise<RegionInventoryRecord[]> {
  try {
    return await query<RegionInventoryRecord>(
      `
      SELECT
        sku,
        region_id::text AS region_id,
        quantity
      FROM region_inventory
      `,
    );
  } catch {
    return await query<RegionInventoryRecord>(
      `
      SELECT
        p.sku,
        ri.region_id::text AS region_id,
        ri.quantity
      FROM region_inventory ri
      JOIN products p ON p.id = ri.product_id
      `,
    );
  }
}

export async function getPickupInventory(): Promise<PickupInventoryRecord[]> {
  try {
    return await query<PickupInventoryRecord>(
      `
      SELECT
        sku,
        pickup_location_id::text AS pickup_location_id,
        quantity
      FROM pickup_inventory
      `,
    );
  } catch {
    return await query<PickupInventoryRecord>(
      `
      SELECT
        p.sku,
        pi.location_id::text AS pickup_location_id,
        pi.quantity
      FROM pickup_inventory pi
      JOIN products p ON p.id = pi.product_id
      `,
    );
  }
}

export async function getDeliveryFeeTiers(
  regionId: string,
): Promise<DeliveryFeeTierRecord[]> {
  try {
    return await query<DeliveryFeeTierRecord>(
      `
      SELECT
        id::text AS id,
        region_id::text AS region_id,
        tier_name,
        COALESCE(description, tier_name) AS description,
        fee_cents,
        estimated_minutes_min,
        estimated_minutes_max,
        COALESCE(sort_order, 0) AS sort_order
      FROM delivery_fee_tiers
      WHERE region_id::text = $1
        AND COALESCE(is_active, true) = true
      ORDER BY sort_order ASC, fee_cents DESC
      `,
      [regionId],
    );
  } catch {
    return await query<DeliveryFeeTierRecord>(
      `
      SELECT
        id::text AS id,
        region_id::text AS region_id,
        'Standard Delivery' AS tier_name,
        (COALESCE(min_distance_km, 0)::text || '-' || COALESCE(max_distance_km, 0)::text || ' km') AS description,
        (fee * 100)::int AS fee_cents,
        NULL::int AS estimated_minutes_min,
        NULL::int AS estimated_minutes_max,
        0 AS sort_order
      FROM delivery_fee_tiers
      WHERE region_id::text = $1
      ORDER BY fee ASC
      `,
      [regionId],
    );
  }
}

export async function getGuestOrderWithItems(
  orderId: string,
  email: string,
): Promise<{
  order: OrderSummaryRecord;
  items: OrderItemRecord[];
} | null> {
  let orders: OrderSummaryRecord[];

  try {
    orders = await query<OrderSummaryRecord>(
      `
      SELECT
        id::text AS id,
        status,
        guest_name,
        guest_email,
        guest_phone,
        fulfillment_type,
        total_cents
      FROM orders
      WHERE id::text = $1
        AND lower(guest_email) = lower($2)
      LIMIT 1
      `,
      [orderId, email],
    );
  } catch {
    orders = await query<OrderSummaryRecord>(
      `
      SELECT
        id::text AS id,
        status,
        guest_name,
        guest_email,
        guest_phone,
        delivery_type AS fulfillment_type,
        (total * 100)::int AS total_cents
      FROM orders
      WHERE id::text = $1
        AND lower(guest_email) = lower($2)
      LIMIT 1
      `,
      [orderId, email],
    );
  }

  if (!orders[0]) {
    return null;
  }

  let items: OrderItemRecord[];
  try {
    items = await query<OrderItemRecord>(
      `
      SELECT
        sku,
        product_name,
        quantity,
        price_in_cents
      FROM order_items
      WHERE order_id::text = $1
      ORDER BY id ASC
      `,
      [orderId],
    );
  } catch {
    items = await query<OrderItemRecord>(
      `
      SELECT
        p.sku,
        COALESCE(p.name, 'Product') AS product_name,
        oi.quantity,
        (oi.price * 100)::int AS price_in_cents
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id::text = $1
      ORDER BY oi.id ASC
      `,
      [orderId],
    );
  }

  return {
    order: orders[0],
    items,
  };
}
