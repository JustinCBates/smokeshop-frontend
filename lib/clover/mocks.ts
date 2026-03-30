import "server-only";
import type {
  CloverCategory,
  CloverCustomer,
  CloverDiscount,
  CloverEmployee,
  CloverItem,
  CloverLineItem,
  CloverList,
  CloverOrder,
  CloverPayment,
  CloverStock,
} from "@/lib/clover/types";

const now = Date.now();

export const mockCategories: CloverCategory[] = [
  { id: "CAT_GLASS", name: "Glass", sortOrder: 10, modifiedTime: now },
  { id: "CAT_VAPES", name: "Vapes", sortOrder: 20, modifiedTime: now },
  { id: "CAT_ACCESS", name: "Accessories", sortOrder: 30, modifiedTime: now },
];

export const mockItems: CloverItem[] = [
  {
    id: "ITEM_GLASS_001",
    code: "GLASS-001",
    name: "Crystal Clear Beaker Bong",
    description: "Premium 14 inch beaker with ice catcher",
    price: 7999,
    hidden: false,
    stockCount: 14,
    modifiedTime: now,
  },
  {
    id: "ITEM_VAPE_001",
    code: "VAPE-001",
    name: "Cloud Chaser Pen",
    description: "Variable voltage vape pen with USB-C charging",
    price: 2999,
    hidden: false,
    stockCount: 25,
    modifiedTime: now,
  },
  {
    id: "ITEM_ACC_001",
    code: "ACC-001",
    name: "4-Piece Herb Grinder",
    description: "Aircraft-grade aluminum grinder",
    price: 1999,
    hidden: false,
    stockCount: 40,
    modifiedTime: now,
  },
];

export const mockStocks: CloverStock[] = mockItems.map((item) => ({
  item: { id: item.id },
  quantity: Number(item.stockCount || 0),
  modifiedTime: now,
}));

export const mockCustomers: CloverCustomer[] = [
  {
    id: "CUS_001",
    firstName: "Alex",
    lastName: "Rivera",
    marketingAllowed: true,
    emailAddresses: { elements: [{ id: "EML_001", emailAddress: "alex@example.com" }] },
    phoneNumbers: { elements: [{ id: "PHN_001", phoneNumber: "+15555550100" }] },
    modifiedTime: now,
  },
];

export const mockEmployees: CloverEmployee[] = [
  { id: "EMP_001", name: "Store Manager", role: "MANAGER", modifiedTime: now },
];

export const mockDiscounts: CloverDiscount[] = [
  { id: "DISC_10", name: "Promo 10", amount: 1000, percentage: false, modifiedTime: now },
];

const mockLineItems: CloverLineItem[] = [
  {
    id: "LI_001",
    name: "Crystal Clear Beaker Bong",
    price: 7999,
    quantity: 1,
    item: { id: "ITEM_GLASS_001" },
    modifiedTime: now,
  },
];

export const mockPayments: CloverPayment[] = [
  {
    id: "PAY_001",
    amount: 7999,
    result: "SUCCESS",
    order: { id: "ORD_001" },
    tender: { id: "TND_001", label: "Credit Card" },
    employee: { id: "EMP_001" },
    modifiedTime: now,
  },
];

export const mockOrders: CloverOrder[] = [
  {
    id: "ORD_001",
    state: "open",
    total: 7999,
    customer: { id: "CUS_001" },
    employee: { id: "EMP_001" },
    lineItems: { elements: mockLineItems },
    payments: { elements: mockPayments },
    modifiedTime: now,
  },
];

export function asCloverList<T>(elements: T[], href?: string): CloverList<T> {
  return { elements, href };
}

export function getPlannedModuleMocks() {
  return {
    categories: asCloverList(mockCategories),
    items: asCloverList(mockItems),
    stocks: asCloverList(mockStocks),
    customers: asCloverList(mockCustomers),
    employees: asCloverList(mockEmployees),
    discounts: asCloverList(mockDiscounts),
    orders: asCloverList(mockOrders),
    payments: asCloverList(mockPayments),
  };
}
