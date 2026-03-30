"use client";

import { siteConfig } from "@/lib/site-config";
import Link from "next/link";
import { Suspense } from "react";
import { LogIn } from "lucide-react";

function LoginForm() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <LogIn className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to {siteConfig.name}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Account login is temporarily unavailable while Supabase
            authentication is being retired.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-foreground">Current checkout flow:</p>
            <p className="text-muted-foreground">1. Add products to cart</p>
            <p className="text-muted-foreground">
              2. Continue as guest at checkout
            </p>
            <p className="text-muted-foreground">
              3. Track orders with email + order ID
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/checkout"
              className="rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue to Checkout
            </Link>
            <Link
              href="/track-order"
              className="rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground hover:border-primary hover:text-primary"
            >
              Track Existing Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
