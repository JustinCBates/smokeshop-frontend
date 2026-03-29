import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History",
};

export default async function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to account
      </Link>

      <h1 className="text-3xl font-bold text-foreground">Order History</h1>

      <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Authenticated order history is temporarily disabled while Supabase auth
        is removed.
      </div>

      <div className="mt-16 flex flex-col items-center text-center">
        <Package className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="mt-4 text-lg font-medium text-foreground">
          Track order by email + order ID
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use guest tracking until account auth is replaced by the backend
          service.
        </p>
        <Link
          href="/track-order"
          className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}
