import { NextResponse } from "next/server";
import {
  getActivePickupLocations,
  getActiveRegions,
} from "@/lib/database/public-data";

export async function GET() {
  try {
    const [regions, pickupLocations] = await Promise.all([
      getActiveRegions(),
      getActivePickupLocations(),
    ]);

    return NextResponse.json({ regions, pickupLocations });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load locations" },
      { status: 500 },
    );
  }
}
