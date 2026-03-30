import { NextRequest, NextResponse } from "next/server";
import { getGuestOrderWithItems } from "@/lib/database/public-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = (body?.orderId || "").trim();
    const email = (body?.email || "").trim();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "orderId and email are required" },
        { status: 400 },
      );
    }

    const result = await getGuestOrderWithItems(orderId, email);
    if (!result) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to track order" },
      { status: 500 },
    );
  }
}
