import Link from "next/link";
import { User, Package, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">My Account</h1>

      <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Account authentication is currently disabled while the platform runs on
        self-hosted PostgreSQL only. Use guest checkout and track your orders by
        email + order ID.
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Guest Checkout Mode
              </h2>
              <p className="text-sm text-muted-foreground">
                No Supabase account session is required
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Auth Provider</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground capitalize">
                none
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Orders</span>
              <span className="text-xs font-medium text-foreground">
                Track by email + order ID
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <Link
            href="/track-order"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Track an Order</p>
              <p className="text-sm text-muted-foreground">
                Lookup using email and order ID
              </p>
            </div>
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Browse Shop</p>
              <p className="text-sm text-muted-foreground">Continue shopping</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
