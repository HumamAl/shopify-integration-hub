import type { Challenge } from "@/lib/types";

export const executiveSummary = "Shopify integrations break at scale — inconsistent APIs, webhook failures, and rate limits create data gaps that erode merchant trust. Here's how I'd architect a platform that stays reliable as store count grows.";

export const challenges: Challenge[] = [
  {
    id: "multi-store-sync",
    title: "Multi-Store Data Synchronization",
    description: "Each Shopify store has its own product catalog, inventory counts, and order streams. When a merchant runs 3-5 stores, keeping inventory in sync across all of them — without overselling or creating ghost products — requires a conflict resolution strategy that handles concurrent writes and API rate limits gracefully.",
    visualizationType: "flow",
    outcome: "Could reduce inventory discrepancies from ~12% to under 1% across connected stores by implementing event-sourced sync with automatic conflict resolution",
  },
  {
    id: "api-rate-resilience",
    title: "API Rate Limit Resilience",
    description: "Shopify enforces strict API rate limits (40 requests/second for REST, cost-based for GraphQL). During peak events like flash sales or BFCM, integration platforms hit these limits fast. Without intelligent request queuing and backoff strategies, sync jobs fail silently and merchants lose orders.",
    visualizationType: "metrics",
    outcome: "Could maintain 99.5%+ API uptime during peak traffic by implementing adaptive rate limiting with priority-based request queuing",
  },
  {
    id: "webhook-reliability",
    title: "Webhook Delivery Guarantee",
    description: "Shopify webhooks are fire-and-forget — if your endpoint is down or slow, events are lost. For an integration platform handling order/create and fulfillment/update events, a single missed webhook can cascade into incorrect inventory, delayed shipping, or duplicate charges.",
    visualizationType: "before-after",
    outcome: "Could achieve 99.9% webhook processing reliability by implementing idempotent handlers with dead-letter queues and automatic retry logic",
  },
];
