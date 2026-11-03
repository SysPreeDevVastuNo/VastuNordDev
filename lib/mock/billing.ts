// Subscription, payment methods and billing history — the prototype's
// `vastunord.billing.v1` record. Amounts are EUR incl. VAT.

export type Subscription = {
  id: string;
  planId: "professional";
  cycle: "monthly" | "yearly";
  status: "active" | "past_due" | "canceled";
  startedAt: number;
  renewsAt: number;
};

export type PaymentMethod = {
  id: string;
  kind: "card";
  brand: "Visa" | "Mastercard";
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault: boolean;
  addedAt: number;
};

export type Transaction = {
  id: string;
  at: number;
  userId: string;
  subscriptionId: string;
  planId: Subscription["planId"];
  kind: "subscription" | "renewal" | "top-up";
  description: string;
  amount: number;
  currency: "EUR";
  tax: number;
  creditBalance: number;
  status: "succeeded" | "failed";
  recovery?: string;
};

export type Invoice = {
  id: string;
  number: string;
  issuedAt: number;
  description: string;
  net: number;
  tax: number;
  total: number;
  status: "paid" | "open";
  transactionId: string;
};

export const mockSubscription: Subscription = {
  id: "sub_8Q2LM4",
  planId: "professional",
  cycle: "monthly",
  status: "active",
  startedAt: 1781602963595,
  renewsAt: 1794735763595,
};

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "pm_visa", kind: "card", brand: "Visa", last4: "4242", expMonth: 8, expYear: 2028, holder: "Mira Lindqvist", isDefault: true, addedAt: 1781602963595 },
  { id: "pm_mc", kind: "card", brand: "Mastercard", last4: "5100", expMonth: 3, expYear: 2025, holder: "Lindqvist Studio AB", isDefault: false, addedAt: 1759138963595 },
];

const renewal = (id: string, at: number, description: string, recovery?: string): Transaction => ({
  id,
  at,
  userId: "user-mira",
  subscriptionId: "sub_8Q2LM4",
  planId: "professional",
  kind: description.includes("first payment") ? "subscription" : "renewal",
  description,
  amount: 61.25,
  currency: "EUR",
  tax: 12.25,
  creditBalance: 300,
  status: "succeeded",
  ...(recovery && { recovery }),
});

export const mockTransactions: Transaction[] = [
  {
    id: "txn_seed_topup",
    at: 1792921363595,
    userId: "user-mira",
    subscriptionId: "sub_8Q2LM4",
    planId: "professional",
    kind: "top-up",
    description: "150 credits",
    amount: 37.5,
    currency: "EUR",
    tax: 7.5,
    creditBalance: 190,
    status: "succeeded",
  },
  renewal("txn_seed_0", 1792143763595, "Professional, monthly — renewal"),
  renewal("txn_seed_1", 1789551763595, "Professional, monthly — renewal"),
  renewal("txn_seed_2", 1786959763595, "Professional, monthly — renewal", "Card declined → retried next day → succeeded"),
  renewal("txn_seed_3", 1784367763595, "Professional, monthly — renewal"),
  renewal("txn_seed_4", 1781775763595, "Professional, monthly — first payment"),
];

export const mockInvoices: Invoice[] = [
  { id: "inv_seed_topup", number: "VN-2026-01045", issuedAt: 1792921363595, description: "Credit pack, 150 credits", net: 30, tax: 7.5, total: 37.5, status: "paid", transactionId: "txn_seed_topup" },
  ...[0, 1, 2, 3, 4].map((i): Invoice => ({
    id: `inv_seed_${i}`,
    number: `VN-2026-0104${4 - i}`,
    issuedAt: mockTransactions[i + 1].at,
    description: i === 4 ? "Professional plan, monthly" : "Professional plan, monthly renewal",
    net: 49,
    tax: 12.25,
    total: 61.25,
    status: "paid",
    transactionId: `txn_seed_${i}`,
  })),
];
