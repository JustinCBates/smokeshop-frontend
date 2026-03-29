import { NextRequest, NextResponse } from "next/server";

const DEFAULT_CLOVER_OAUTH_BASE_URL = "https://sandbox.dev.clover.com";

function getRedirectUri(request: NextRequest): string {
  return (
    process.env.CLOVER_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/clover/callback`
  );
}

function getOauthBaseUrl(): string {
  return process.env.CLOVER_OAUTH_BASE_URL || DEFAULT_CLOVER_OAUTH_BASE_URL;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const merchantId = request.nextUrl.searchParams.get("merchant_id");
  const employeeId = request.nextUrl.searchParams.get("employee_id");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      {
        error: "Missing Clover authorization code",
        authorizeUrl: `${getOauthBaseUrl()}/oauth/authorize?client_id=${encodeURIComponent(process.env.CLOVER_APP_ID || "")}&response_type=code&redirect_uri=${encodeURIComponent(getRedirectUri(request))}`,
      },
      { status: 400 },
    );
  }

  const clientId = process.env.CLOVER_APP_ID;
  const clientSecret = process.env.CLOVER_APP_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: "Missing Clover app credentials",
        missing: [
          !clientId ? "CLOVER_APP_ID" : null,
          !clientSecret ? "CLOVER_APP_SECRET" : null,
        ].filter(Boolean),
      },
      { status: 500 },
    );
  }

  const redirectUri = getRedirectUri(request);
  const response = await fetch(`${getOauthBaseUrl()}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const rawText = await response.text();

  let payload: Record<string, unknown>;

  try {
    payload = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
  } catch {
    payload = { raw: rawText };
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Failed to exchange Clover authorization code",
        cloverStatus: response.status,
        merchantId,
        employeeId,
        state,
        details: payload,
      },
      { status: response.status },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      merchantId,
      employeeId,
      state,
      redirectUri,
      oauthBaseUrl: getOauthBaseUrl(),
      token: payload,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}