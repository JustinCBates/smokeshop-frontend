import "server-only";

export interface CloverRef {
  id: string;
}

export interface CloverList<T> {
  elements: T[];
  href?: string;
}

export interface CloverCustomerEmail {
  id: string;
  emailAddress: string;
}

export interface CloverCustomerPhone {
  id: string;
  phoneNumber: string;
}

export interface CloverCustomerAddress {
  id: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
}

export interface CloverCustomer {
  id: string;
  firstName?: string;
  lastName?: string;
  marketingAllowed?: boolean;
  createdTime?: number;
  modifiedTime?: number;
  emailAddresses?: CloverList<CloverCustomerEmail>;
  phoneNumbers?: CloverList<CloverCustomerPhone>;
  addresses?: CloverList<CloverCustomerAddress>;
}

export interface CloverEmployee {
  id: string;
  name?: string;
  role?: string;
  createdTime?: number;
  modifiedTime?: number;
}

export interface CloverCategory {
  id: string;
  name: string;
  sortOrder?: number;
  createdTime?: number;
  modifiedTime?: number;
}

export interface CloverDiscount {
  id: string;
  name: string;
  amount?: number;
  percentage?: boolean;
  createdTime?: number;
  modifiedTime?: number;
}

export interface CloverItem {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: number;
  hidden?: boolean;
  stockCount?: number;
  quantity?: number;
  createdTime?: number;
  modifiedTime?: number;
  categories?: CloverList<CloverCategory>;
}

export interface CloverLineItem {
  id: string;
  name?: string;
  price?: number;
  quantity?: number;
  item?: CloverRef;
  createdTime?: number;
  modifiedTime?: number;
}

export interface CloverPayment {
  id: string;
  amount: number;
  tipAmount?: number;
  taxAmount?: number;
  cashbackAmount?: number;
  result?: "SUCCESS" | "FAIL" | "OFFLINE";
  createdTime?: number;
  modifiedTime?: number;
  order?: CloverRef;
  tender?: CloverRef & { label?: string };
  employee?: CloverRef;
}

export interface CloverOrder {
  id: string;
  state?: string;
  total?: number;
  note?: string;
  createdTime?: number;
  modifiedTime?: number;
  customer?: CloverRef;
  employee?: CloverRef;
  lineItems?: CloverList<CloverLineItem>;
  payments?: CloverList<CloverPayment>;
}

export interface CloverStock {
  item: CloverRef;
  quantity: number;
  modifiedTime?: number;
}
