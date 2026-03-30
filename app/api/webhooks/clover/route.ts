import { NextRequest, NextResponse } from "next/server";

type CloverWebhookPayload = {
  verificationCode?: string;
  appId?: string;
  merchants?: Record<
    string,
    Array<{ objectId: string; type: string; ts: number }>
  >;
};

let lastVerificationCode: string | null = null;
let lastVerificationAt: string | null = null;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const payload: CloverWebhookPayload = rawBody ? JSON.parse(rawBody) : {};

    const configuredAuthCode = process.env.CLOVER_WEBHOOK_SECRET;
    const cloverAuthHeader = req.headers.get("x-clover-auth");

    // Clover sends X-Clover-Auth on verified webhook notifications.
    if (
      configuredAuthCode &&
      cloverAuthHeader &&
      cloverAuthHeader !== configuredAuthCode
    ) {
      return NextResponse.json(
        { error: "Invalid Clover auth header" },
        { status: 401 },
      );
    }

    if (payload.verificationCode) {
      lastVerificationCode = payload.verificationCode;
      lastVerificationAt = new Date().toISOString();
      return NextResponse.json({
        verificationCode: payload.verificationCode,
        verified: true,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process Clover webhook" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "clover-webhook",
    lastVerificationCode,
    lastVerificationAt,
  });
}
