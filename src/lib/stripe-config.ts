export const FREE_WEEKLY_VIEW_LIMIT = 1;

export const TIERS = {
  standard: {
    name: "Standard",
    price: 999, // cents
    interval: "month" as const,
    description: "Unlimited videos + 1080p",
  },
  premium: {
    name: "Premium",
    price: 1999, // cents
    interval: "month" as const,
    description: "Unlimited videos + early access + 4K",
  },
} as const;
