import type { LucideIcon } from "lucide-react";

// Sidebar navigation
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Challenge visualization types
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// Proposal types
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ─── Shopify Integration Hub Domain Types ────────────────────────────────────

export type StoreStatus = "connected" | "syncing" | "error" | "disconnected";

export type StorePlan =
  | "basic"
  | "shopify"
  | "advanced"
  | "plus"
  | "starter";

/** A merchant's connected Shopify store */
export interface Store {
  id: string;                     // "sto_k8m2p"
  name: string;                   // "Harmon Street Apparel"
  domain: string;                 // "harmon-street.myshopify.com"
  status: StoreStatus;
  plan: StorePlan;
  productCount: number;
  orderCount: number;             // total lifetime orders
  /** Monthly GMV managed through the integration */
  monthlyGmv: number;
  lastSync: string;               // ISO datetime
  connectedAt: string;            // ISO datetime
  /** Only present when status === "error" */
  errorMessage?: string;
  timezone: string;               // "America/New_York"
  currency: "USD" | "CAD" | "GBP" | "EUR" | "AUD";
}

export type IntegrationType =
  | "payment"
  | "shipping"
  | "inventory"
  | "marketing"
  | "analytics";

export type IntegrationStatus = "active" | "paused" | "error" | "setup";

/** An active integration between a store and a third-party service */
export interface Integration {
  id: string;                     // "int_p3k7n"
  name: string;                   // "Stripe Payments"
  type: IntegrationType;
  provider: string;               // "Stripe"
  status: IntegrationStatus;
  storeId: string;                // references Store.id
  /** Webhook events processed in the last 30 days */
  eventsProcessed: number;
  lastEvent: string;              // ISO datetime
  /** Percentage of events that resulted in an error */
  errorRate: number;              // 0–100, e.g. 2.4
  /** Only present when status === "error" */
  errorMessage?: string;
  installedAt: string;            // ISO datetime
  apiVersion?: string;            // "2024-01"
}

export type SyncJobType = "products" | "orders" | "inventory" | "customers";

export type SyncJobStatus =
  | "completed"
  | "running"
  | "failed"
  | "queued"
  | "partial";

export interface SyncJob {
  id: string;                     // "job_b4n9s"
  storeId: string;                // references Store.id
  storeName: string;              // denormalized for display
  type: SyncJobType;
  status: SyncJobStatus;
  itemsSynced: number;
  itemsFailed: number;
  startedAt: string;              // ISO datetime
  completedAt: string | null;     // null if still running/queued
  /** Duration in seconds */
  duration: number | null;
  /** Only present when status === "failed" or "partial" */
  failureReason?: string;
  triggeredBy: "scheduled" | "manual" | "webhook";
}

export type WebhookTopic =
  | "orders/create"
  | "orders/updated"
  | "orders/cancelled"
  | "products/create"
  | "products/update"
  | "fulfillments/create"
  | "inventory_levels/update"
  | "customers/create"
  | "refunds/create"
  | "app/uninstalled";

export type WebhookStatus = "delivered" | "failed" | "pending" | "retrying";

/** An individual webhook event from a Shopify store */
export interface WebhookEvent {
  id: string;                     // "evt_m1r6t"
  topic: WebhookTopic;
  storeId: string;                // references Store.id
  storeName: string;              // denormalized for display
  status: WebhookStatus;
  /** Human-readable summary of the payload */
  payloadSummary: string;
  receivedAt: string;             // ISO datetime
  processedAt: string | null;     // null if not yet processed
  /** How many delivery attempts have been made */
  attempts: number;
  /** Present when status === "failed" or "retrying" */
  errorCode?: string;
  /** HTTP status returned by the endpoint */
  responseCode?: number;
}

/** API usage metrics for a single calendar day */
export interface ApiUsage {
  date: string;                   // "2026-02-14"
  calls: number;
  errors: number;
  /** Average response latency in milliseconds */
  avgLatencyMs: number;
  /** Shopify rate limit bucket remaining (out of 40) */
  rateLimitRemaining: number;
}

/** Monthly revenue and order chart data point */
export interface RevenueData {
  month: string;                  // "Mar"
  gmv: number;                    // Gross Merchandise Value in USD
  orders: number;
  stores: number;                 // active connected stores that month
}

/** API usage chart data point (monthly rollup) */
export interface ApiUsageMonthly {
  month: string;
  calls: number;
  errors: number;
  avgLatencyMs: number;
}

/** Categorical breakdown for pie/bar charts */
export interface IntegrationBreakdown {
  type: IntegrationType;
  count: number;
  activeCount: number;
}

/** Top-level KPI cards on the dashboard */
export interface DashboardStats {
  connectedStores: number;
  /** % change vs previous 30 days */
  storesChange: number;
  activeIntegrations: number;
  integrationsChange: number;
  /** Orders processed through integrations in last 30 days */
  ordersProcessed: number;
  ordersChange: number;
  /** Products synced across all stores in last 30 days */
  productsSynced: number;
  productsSyncedChange: number;
  /** Webhook delivery success rate, 0–100 */
  webhookDeliveryRate: number;
  webhookRateChange: number;
  /** Total GMV managed through the platform in last 30 days */
  totalGmv: number;
  gmvChange: number;
  /** API uptime percentage */
  apiUptime: number;
  syncSuccessRate: number;
}
