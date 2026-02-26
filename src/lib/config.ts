// App configuration — single source of truth for all identity/attribution text.

export type AestheticProfile =
  | "linear"
  | "bold-editorial"
  | "warm-organic"
  | "corporate-enterprise"
  | "dark-premium"
  | "swiss-typographic"
  | "glassmorphism"
  | "neobrutalism"
  | "nature-wellness"
  | "data-dense"
  | "saas-modern"
  | "e-commerce"
  | "brand-forward"
  | "retrofuturism";

export const APP_CONFIG = {
  appName: "IntegrateFlow",
  projectName: "Shopify Integration Hub",
  clientName: null as string | null,
  domain: "ecommerce-integration",
  aesthetic: "saas-modern" as AestheticProfile,
} as const;
