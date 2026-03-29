import { NextRequest, NextResponse } from "next/server";
import { getDeliveryFeeTiers } from "@/lib/database/public-data";

export async function GET(request: NextRequest) {
  const regionId = request.nextUrl.searchParams.get("region_id") || "";

  if (!regionId) {
    return NextResponse.json(
      { error: "region_id is required" },
      { status: 400 },
    );
  }

  try {
    const tiers = await getDeliveryFeeTiers(regionId);
    return NextResponse.json({ tiers });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load delivery fee tiers" },
      { status: 500 },
    );
  }
}
