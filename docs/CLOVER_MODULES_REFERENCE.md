# Clover Modules Reference

This document captures Clover data shapes we can model against while sandbox service-plan gating blocks some modules.

Source references:
- https://docs.clover.com/dev/docs/understanding-modules
- https://docs.clover.com/dev/docs/test-an-app-with-different-merchant-service-plans
- https://docs.clover.com/dev/docs/permissions

## Module Catalog

The Clover module list is region and service-plan dependent. In North America, these are the core modules commonly exposed in app settings and module availability:

1. Payments
2. Orders
3. Customers
4. Items (Inventory items)
5. Department (Categories)
6. Discounts
7. Employees

Notes:
- Merchants on entry-level plans may only grant Payments and limited Orders access.
- If required modules are missing from a merchant service plan, app install/connect can be blocked with "not available with your service plan".

## Canonical Shape Rules

1. Collection/list responses usually use `elements` and optionally `href`.
2. Money values are integer cents.
3. Times are Unix epoch milliseconds.
4. Nested objects are often lightweight references unless explicitly expanded.

## Core JSON Shapes by Module

### Payments

```json
{
  "id": "PAYMENT_ID",
  "amount": 1299,
  "tipAmount": 0,
  "taxAmount": 0,
  "result": "SUCCESS",
  "createdTime": 1774800000000,
  "order": { "id": "ORDER_ID" },
  "tender": { "id": "TENDER_ID", "label": "Credit Card" }
}
```

### Orders

```json
{
  "id": "ORDER_ID",
  "state": "open",
  "total": 2499,
  "createdTime": 1774800000000,
  "lineItems": { "elements": [] },
  "payments": { "elements": [] },
  "customer": { "id": "CUSTOMER_ID" }
}
```

### Customers

```json
{
  "id": "CUSTOMER_ID",
  "firstName": "Jane",
  "lastName": "Doe",
  "marketingAllowed": true,
  "emailAddresses": {
    "elements": [
      { "id": "EMAIL_ID", "emailAddress": "jane@example.com" }
    ]
  }
}
```

### Items (Inventory)

```json
{
  "id": "ITEM_ID",
  "code": "SKU-001",
  "name": "Sample Item",
  "price": 1999,
  "hidden": false,
  "modifiedTime": 1774800000000
}
```

### Department (Category)

```json
{
  "id": "CATEGORY_ID",
  "name": "Vapes",
  "sortOrder": 10,
  "modifiedTime": 1774800000000
}
```

### Discounts

```json
{
  "id": "DISCOUNT_ID",
  "name": "Promo 10",
  "amount": 1000,
  "percentage": false,
  "modifiedTime": 1774800000000
}
```

### Employees

```json
{
  "id": "EMPLOYEE_ID",
  "name": "Manager User",
  "role": "MANAGER",
  "modifiedTime": 1774800000000
}
```

## Mock Data Location

The Clover-aligned TypeScript models and mocks are defined in:

- [lib/clover/types.ts](lib/clover/types.ts)
- [lib/clover/mocks.ts](lib/clover/mocks.ts)

To run storefront inventory against Clover-shaped mocks during plan-gating:

`CLOVER_USE_MOCKS=true`
