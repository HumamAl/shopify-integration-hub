# Domain Knowledge Brief — Shopify / eCommerce Integration Platform (iPaaS)

## Sub-Domain Classification

**Shopify-centric iPaaS (Integration Platform as a Service)** — A middleware platform that connects Shopify and other online storefronts to downstream business systems: ERPs (NetSuite, Dynamics 365), 3PLs, CRMs, marketing automation, inventory management, and analytics tools. Target clients: Shopify merchants scaling from single-store to multi-store + multi-channel, needing real-time sync across systems without custom engineering overhead. Typical client company size: 5-50 person operations team, $500K-$20M GMV/year.

---

## Job Analyst Vocabulary — Confirmed and Extended

This domain sits at the intersection of **eCommerce operations** and **developer tooling**. The Job Analyst vocabulary for e-commerce applies partially, but the integration/platform layer introduces its own specialized vocabulary that must dominate the UI.

### Confirmed Primary Entity Names

These are the words that must appear in every UI label — sidebar nav, table headers, KPI card titles, status badges, search placeholders.

- Primary record type: **integration** (not "connection" or "link") — a configured pipeline between two systems
- Secondary record type: **sync job** (not "task" or "run") — a single execution of an integration pipeline
- Third record type: **webhook** (not "event listener" or "notification") — event trigger from Shopify to external system
- Shopify-side entity: **store** (not "account" or "tenant") — a connected Shopify storefront
- Data passing through: **payload** (not "data" or "record")
- Error capture: **error log** or **sync error** (not "issue" or "problem")
- Automated rule: **workflow** or **flow** (Shopify's own term; competitors use "recipe" or "automation")
- Connected external system: **connector** or **destination** (not "app" or "endpoint")
- Manual override of sync: **replay** or **retry** (not "redo" or "resend")

### Expanded KPI Vocabulary

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Sync Success Rate | % of sync jobs that completed without errors | % (e.g., 97.3%) |
| API Uptime | Platform availability over rolling 30 days | % (e.g., 99.94%) |
| Orders Synced (Today) | Count of Shopify orders pushed downstream today | count integer |
| Products Synced | Count of product/variant records synced across all stores | count integer |
| Avg Sync Latency | Average time from webhook receipt to downstream write | ms or seconds |
| Error Rate | % of sync jobs that failed in the last 30 days | % (e.g., 2.7%) |
| Webhook Delivery Rate | % of webhooks successfully processed (vs. timed out/rejected) | % |
| Active Integrations | Count of live, enabled integration pipelines | count integer |
| Connected Stores | Number of Shopify storefronts linked to the platform | count integer |
| API Calls (Today) | Total GraphQL/REST calls made against Shopify API today | count with budget |
| Rate Limit Hits | Count of 429 errors received from Shopify in last 24h | count (should be 0) |
| Inventory Discrepancies | Records where platform stock != Shopify stock | count (alert if > 0) |

### Status Label Vocabulary

- Active states: `Active`, `Syncing`, `Pending`, `Queued`, `Scheduled`, `In Progress`
- Problem states: `Failed`, `Rate Limited`, `Timed Out`, `Partial Sync`, `Auth Error`, `Version Mismatch`
- Terminal states: `Completed`, `Disabled`, `Archived`, `Deprecated`
- Webhook-specific: `Delivered`, `Processing`, `Rejected`, `Retrying`, `Unverified`

### Workflow and Action Vocabulary

- Primary actions: `sync`, `replay`, `retry`, `disable`, `archive`, `trigger`, `publish`, `connect`
- Secondary actions: `throttle`, `backfill`, `map fields`, `validate`, `preview payload`, `test webhook`
- System actions: `resubscribe`, `rotate credentials`, `deprecate endpoint`, `migrate version`

### Sidebar Navigation Candidates

These use Shopify integration platform vocabulary — not generic SaaS labels:

1. **Overview** (the dashboard — operators use "Overview" not "Dashboard" in iPaaS tools)
2. **Integrations** (the core entity — the pipelines list)
3. **Sync Jobs** (the execution log — every run, status, latency)
4. **Webhooks** (event management — topics, delivery status, retry queue)
5. **Connected Stores** (multi-store management — one Shopify store per card)
6. **Error Logs** (failed syncs, retry queue, resolution notes)
7. **API Usage** (rate limit consumption, call budget, throttle alerts)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

The Shopify ecosystem has a very specific and well-known visual language. Shopify's own **Polaris design system** — used across the Admin and in all certified Shopify apps — defines the aesthetic baseline that every merchant and developer in this space has internalized. Polaris is clean, card-based, table-dense, uses a restrained green accent on white, generous spacing in the admin header, and compact data tables below. The color palette is almost entirely neutral with a single brand green (`#008060` approximately, translated to oklch `oklch(0.55 0.14 160)`).

Integration platform tools (Celigo, Mesa, Alloy, Patchworks) layer on top of this baseline with a more "developer tool" aesthetic: flow diagrams, status indicators with color-coded health dots, log viewers, and real-time counters. They lean toward **SaaS Modern** with slightly higher information density than Shopify Admin itself. Think: left sidebar with icon + label nav, a top stats bar showing uptime/sync rate, and tabbed content areas for configuration vs. logs.

The key visual tension: this tool is used by **both technical developers** (who configure integrations) and **operations managers** (who monitor sync health). Premium tools in this space serve both: clean monitoring panels for ops (big numbers, color-coded health), and detailed payload inspection for developers (monospace, JSON-like displays, error traces). A great integration hub UI shows "all green" at a glance and lets you drill into failures with one click.

### Real-World Apps Clients Would Recognize as "Premium"

1. **Shopify Admin (Polaris)** — The baseline every Shopify-ecosystem tool is compared against. Card-based layout, white background, subtle gray borders, restrained green accent for primary actions, clean sans-serif (now Inter-based), full-width data tables with compact rows. Merchants immediately recognize this aesthetic as "official Shopify quality."

2. **Celigo iPaaS** — The enterprise-tier competitor. Blue-dominant, flow diagram-centric UI with node-based integration builder, tabular job history, health status sidebar. Denser than Shopify Admin. Clients who have seen Celigo know what "serious integration tooling" looks like.

3. **Mesa (GetMesa.com)** — The Shopify-native automation tool. Stays closest to Polaris conventions (white, green accents, card-based). Step-by-step workflow builder, trigger + action paradigm. Friendly, approachable. Shopify App Store certified.

4. **Alloy Automation** — More technical, darker accent colors, developer-leaning. Excellent for multi-app integration chains. Good reference for "what 100+ connector platforms look like visually."

### Aesthetic Validation

- **Job Analyst recommendation (expected)**: SaaS Modern or E-Commerce
- **Domain validation**: **SaaS Modern is correct.** This is a developer-facing operations tool built for the Shopify ecosystem. The E-Commerce aesthetic (product-centric, conversion-optimized, warmer tones) is wrong for an integration platform — that's for the merchant's storefront. The platform itself is a B2B SaaS tool. SaaS Modern (card-based, clean, Geist or Inter typography, medium radius, professional-but-approachable) is the right call, with a **Shopify-green primary** instead of the default neutral.
- **Color nuance**: Use a desaturated, professional green — `oklch(0.52 0.13 160)` — rather than any warm or saturated green. Shopify's brand green is specific and well-known; getting it roughly right reads as intentional. Avoid lime green or forest green.
- **Density**: **Standard-to-compact**. Ops users monitor many integration runs. The sync job log should be compact (30px rows). The overview cards can have standard spacing. Avoid spacious — this is a tool, not a marketing page.

### Density and Layout Expectations

**Standard density with compact data tables.** Practitioners use this tool to monitor health at a glance and investigate failures. The overview/dashboard should have breathing room (stat cards with standard padding). The sync job log table should be compact — operators scan dozens of rows at once.

**Primarily list/table-heavy** with a card layer on top. The dominant pattern is:
1. Stat card row (health metrics at the top)
2. Integration list or sync job table (the main working surface)
3. Detail drawer or modal for individual record inspection

No heavy card grids (that's for product catalogs). This tool lives in tables, status badges, and log entries.

---

## Entity Names (10+ realistic names)

### Companies / Organizations (Shopify merchant clients using this platform)

- Ridgeline Outdoor Co. (D2C outdoor gear, Shopify Plus)
- Northgate Provisions (specialty food, multi-location)
- Clearwater Home Goods (furniture and home, high AOV)
- Apex Athletic Wear (D2C activewear, high volume)
- Fenwick & Marsh Co. (boutique apparel, two storefronts)
- Solstice Skincare (beauty/wellness, DTC + wholesale)
- Ironside Supply (B2B hardware/industrial, Shopify B2B)
- Vantage Pet Goods (pet products, marketplace + DTC)
- BluePine Provisions (subscription box, recurring orders)
- Harborview Furniture (high-ticket, 3PL-dependent)

### People Names (integration platform operators)

**Dev/Technical:**
- Kenji Watanabe (Integration Engineer)
- Priya Chandrasekaran (Platform Developer)
- Marcus Webb (Solutions Architect)

**Ops/Business:**
- Sarah Okonkwo (eCommerce Operations Manager)
- Carlos Restrepo (Director of Technology, Ridgeline Outdoor)
- Emma Thornton (Head of Operations, Northgate Provisions)
- David Kim (Shopify Developer, Fenwick & Marsh)
- Rachel Goldstein (eComm Tech Lead, Apex Athletic)

### Products / Services / Connectors (system destinations)

- NetSuite ERP Connector
- QuickBooks Online Sync
- Klaviyo Order Trigger
- Gorgias Ticket Sync
- ShipStation Fulfillment Bridge
- Cin7 Inventory Connector
- Recharge Subscription Sync
- Google Merchant Feed
- Amazon Listing Sync
- Brightpearl OMS Connector
- Yotpo Review Pull
- Attentive SMS Order Trigger

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Sync Success Rate | 92% | 97.3% | 99.8% | Below 95% is operationally problematic |
| API Uptime (30-day) | 98.1% | 99.7% | 99.99% | SLA is typically 99.9%; below 99% = churn risk |
| Avg Sync Latency | 340ms | 1.2s | 8.4s | Webhook receipt to downstream write; >5s raises concerns |
| Orders Synced/Day | 47 | 840 | 12,400 | Scales with merchant GMV; BFCM peaks 5-10x |
| Products/Variants Synced | 280 | 4,700 | 48,000 | High count = many variant combinations |
| Webhooks/Day | 120 | 2,800 | 35,000 | Spikes during flash sales, inventory updates |
| Error Rate (30-day) | 0.2% | 2.7% | 8.4% | Above 5% triggers alert; above 10% = broken integration |
| Rate Limit Hits/Day | 0 | 12 | 340 | 429 errors from Shopify; should approach 0 |
| Inventory Discrepancies | 0 | 3 | 47 | Active/open discrepancies; should be 0 ideally |
| Connected Stores | 1 | 4 | 28 | Enterprise clients manage 10+ storefronts |
| Active Integrations | 2 | 11 | 64 | Per tenant/client; enterprise has many more |
| Field Mapping Rules | 8 | 34 | 210 | Per integration; complex ERPs need many |
| Payload Size (avg) | 2.1KB | 18.4KB | 340KB | Large product catalogs produce large payloads |

---

## Industry Terminology Glossary (15+ terms)

| Term | Definition | Usage Context |
|------|-----------|---------------|
| Webhook | HTTP callback sent by Shopify when an event occurs (order created, inventory updated, etc.) | Trigger for sync jobs |
| Admin API | Shopify's GraphQL and REST API for store management operations | Used in all integrations; GraphQL preferred in 2025 |
| Storefront API | Shopify's customer-facing API for building headless experiences | Separate from Admin API; used for custom frontends |
| Metafield | Custom data field attached to Shopify objects (products, orders, customers) | Synced to ERPs as custom attributes |
| Variant | A specific product configuration (size, color, material combination) | Each variant has its own SKU, price, and inventory |
| Collection | A grouped set of products in Shopify (manual or automated) | Synced to marketing tools, catalog systems |
| Fulfillment Location | A physical or virtual location from which orders are fulfilled | Shopify supports multiple locations; inventory tracked per location |
| Shopify Flow | Shopify's native automation tool (competitor to Mesa/Alloy) | Often replaced or augmented by integration platforms |
| iPaaS | Integration Platform as a Service — cloud-based middleware connecting disparate systems | The product category this platform occupies |
| Payload | The JSON data body of a webhook or API response | Inspected in error logs; mapped via field mapping rules |
| Field Mapping | Configuring which source field maps to which destination field | Core configuration step for every integration |
| Rate Limit (429) | Shopify API error when request volume exceeds allowed bucket | 40 credits/second GraphQL; 2 req/sec REST |
| Backfill | Retroactive sync of historical data from Shopify to a destination system | Run when a new integration is first connected |
| Idempotency | Property ensuring the same webhook can be processed multiple times without duplicate records | Critical for retry logic; Shopify may redeliver webhooks |
| Delta Sync | Syncing only records that changed since the last sync (not full catalog rescan) | Efficient; contrast with "full sync" |
| Shopify Plus | Shopify's enterprise tier with higher API rate limits, B2B features, and multi-store capabilities | Clients on Plus have higher API budgets |
| GID | Shopify's Global ID format (`gid://shopify/Product/12345678`) used in GraphQL responses | Must be parsed/decoded when storing downstream |
| Checkout Extension | UI customization at the Shopify checkout step (not the same as an integration) | Separate from integration work |
| HMAC Verification | Cryptographic validation that a webhook actually came from Shopify (not a forged request) | Security requirement; failure = webhook rejected |
| Retry Queue | List of failed webhook deliveries being automatically retried | Shopify retries up to 5 times over 48 hours |

---

## Common Workflows

### Workflow 1: New Order Sync to ERP (Core Flow)

1. Customer places order on Shopify storefront
2. Shopify fires `orders/create` webhook to integration platform endpoint
3. Platform validates HMAC signature (reject if invalid)
4. Platform parses payload — extracts order ID, line items, customer, shipping address
5. Field mapping engine transforms Shopify fields to ERP schema
6. Platform calls ERP API to create sales order record
7. ERP returns order reference number
8. Platform writes order reference back to Shopify order as a metafield
9. Sync job record created with status `Completed`, latency logged
10. If ERP call fails: job status = `Failed`, error logged, retry queued (up to 3 attempts)

### Workflow 2: Inventory Level Sync (Bidirectional)

1. Inventory updated in ERP (warehouse receives stock)
2. Integration platform polls ERP for inventory changes (delta sync every 15 min) OR ERP pushes via webhook
3. Platform identifies affected SKUs and maps to Shopify variant IDs
4. Platform calls Shopify `POST /admin/api/inventory_levels/set.json` for each location
5. Shopify confirms update; platform logs sync record
6. Reverse direction: Shopify `inventory_levels/update` webhook fires when storefront sale depletes stock
7. Platform pushes depletion event to ERP/WMS to reserve allocation
8. Discrepancy check: if platform stock record != Shopify level after sync, flag as `Inventory Discrepancy`

### Workflow 3: Onboarding a New Shopify Store

1. Merchant clicks "Connect Shopify Store" — redirects to Shopify OAuth flow
2. Merchant grants permissions (read/write orders, products, inventory, customers)
3. Platform receives `access_token` via OAuth callback; stores securely
4. Platform registers webhook subscriptions for all configured topics (orders/create, products/update, inventory_levels/update, etc.)
5. Backfill triggered: platform fetches last 90 days of orders, products, and customers via pagination
6. Admin configures field mapping rules (Shopify fields → destination system fields)
7. Test sync run: 1 order, 5 products — operator validates output in destination
8. Integration enabled: live traffic begins flowing; monitoring dashboard shows first sync jobs

---

## Common Edge Cases

1. **Rate limit cascade** — Platform hits Shopify's 40 GraphQL credit/second limit during a flash sale; hundreds of `429` errors queued; sync latency spikes from 1.2s to 45s; orders pile up in retry queue
2. **Webhook delivery failure loop** — Shopify retries a webhook 5 times over 48 hours; platform processes it each time without idempotency check; order created 5 times in ERP — duplicate detection required
3. **API version deprecation** — Shopify deprecates a REST endpoint used in a connector (quarterly API versioning); integration silently fails with `410 Gone`; no alert configured; hours of missed syncs
4. **Variant count overflow** — Product updated to 2,000 variants; webhook payload only includes first 100 variants; platform syncs incomplete data to ERP; inventory mismatch for variants 101-2,000
5. **Multi-store conflict** — Same customer email exists in Store A and Store B; when syncing to shared CRM, platform creates duplicate customer records; conflict resolution rule not configured
6. **OAuth token expiry** — Shopify access token revoked when merchant uninstalls/reinstalls app; all webhook registrations dropped; sync silently stops until token rotated
7. **Field mapping null error** — ERP requires a `cost_center` field; Shopify order has no equivalent; field mapping returns null; ERP rejects record — unhandled null causes `Partial Sync` status
8. **BFCM volume spike** — Black Friday traffic: 8,400 orders in 6 hours (vs. 340 typical daily volume); platform queue backs up; sync latency hits 18 minutes; some orders arrive at 3PL after promised ship window

---

## What Would Impress a Domain Expert

1. **Shopify API versioning awareness** — Showing that integrations track the API version they use (`2025-01`, `2024-10`) and flagging when a version approaches deprecation. Shopify deprecates API versions quarterly. An integration platform that shows "API version: 2024-07 — deprecates in 43 days" demonstrates deep Shopify ecosystem knowledge.

2. **Rate limit budget display** — Showing available GraphQL credit bucket (out of 40/second) and REST calls (out of 2/second) in real time. This is the #1 operational concern for high-volume integrations. A KPI card showing "Rate Limit Headroom: 78%" is immediately recognizable as platform-literate.

3. **Webhook topic coverage map** — A visual showing which Shopify webhook topics are subscribed vs. unsubscribed for each store. Missing subscriptions = missed events. Practitioners know this is a common source of "silent failures."

4. **Idempotency key tracking** — Every sync job record should show the Shopify webhook `X-Shopify-Webhook-Id` that triggered it. Duplicate prevention is the #1 data quality concern in Shopify integrations, and showing idempotency key tracking signals professional-grade engineering.

5. **GID-aware field display** — Shopify's GraphQL API returns Global IDs in format `gid://shopify/Product/8471923847`. A platform that decodes these for display (showing "8471923847" not the full GID) and handles them in field mapping shows GraphQL-native implementation, not a REST-to-GraphQL wrapper.

---

## Common Systems & Tools Used

| System | Type | Why It Appears |
|---|---|---|
| Shopify Admin API (GraphQL) | Core data source | All product, order, customer, inventory data |
| NetSuite ERP | Common destination | Most common ERP for $5M+ Shopify merchants |
| Microsoft Dynamics 365 Business Central | Destination | Mid-market ERP; native Shopify connector exists but often supplemented |
| QuickBooks Online | Destination | Small-business accounting sync |
| Klaviyo | Destination | Email/SMS marketing — order trigger, customer segment sync |
| ShipStation | Destination | Order fulfillment — receives order, returns tracking number |
| Cin7 / DEAR Inventory | Destination | Mid-market inventory management |
| Gorgias | Destination | Customer support — order context injected into tickets |
| Recharge | Source/destination | Subscription management — recurring order events |
| Brightpearl | Destination | Omnichannel OMS — common in UK/EU Shopify Plus merchants |

---

## Geographic / Cultural Considerations

- Shopify is headquartered in Canada; many merchants are US/CA/UK/AU-based — prices should use USD (primary) with occasional CAD and GBP for multi-region stores
- Shopify Plus clients often have international storefronts — multi-currency handling (`presentment_currency` vs. `shop_currency`) is a real edge case in order sync
- UK merchants use Shopify's fulfillment with Royal Mail/DPD rather than USPS/UPS — if showing carrier data, include UK carriers
- EU merchants deal with VAT-inclusive pricing and EU shipping regulations — tax sync is more complex than US merchants
- Time zones matter: Shopify webhook timestamps are UTC; ERP systems often use local business time — timezone conversion is a real pain point in sync logs

---

## Data Architect Notes

- **Primary entity**: `Integration` — each one represents a configured pipeline between a Shopify store and a destination system. Fields: `id` (INT-XXXX format), `storeId`, `destinationSystem`, `status`, `syncMode` ("real_time" | "scheduled"), `fieldMappingCount`, `lastSyncAt`, `successRate`, `avgLatencyMs`
- **Secondary entity**: `SyncJob` — each execution of an integration. Fields: `id` (JOB-XXXXX format), `integrationId`, `triggeredBy` ("webhook" | "schedule" | "manual"), `status` ("completed" | "failed" | "partial" | "retrying"), `payloadSizeKb`, `latencyMs`, `errorCode` (optional), `shopifyWebhookId` (for idempotency display), `processedAt`
- **Tertiary entity**: `ConnectedStore` — each Shopify storefront linked to the platform. Fields: `id` (STORE-XXX format), `shopDomain` (e.g., "ridgeline-outdoor.myshopify.com"), `displayName`, `plan` ("basic" | "shopify" | "advanced" | "plus"), `status` ("active" | "auth_error" | "disconnected"), `apiVersion` ("2025-01"), `webhookCount`, `integrationCount`, `ordersToday`
- **Webhook entity**: `WebhookLog` — individual webhook deliveries. Fields: `id` (WH-XXXXXX format), `topic` (exact Shopify topic: "orders/create", "inventory_levels/update"), `storeId`, `status` ("delivered" | "processing" | "failed" | "retrying"), `deliveryAttempts`, `payloadSizeKb`, `receivedAt`, `processedAt`
- **Metric ranges for fields**: `successRate` range 91.2%-99.8%; `avgLatencyMs` range 220-8400; `payloadSizeKb` range 1.8-347.2; use non-round numbers everywhere
- **Status distributions**: 70% of integrations `active`, 15% `syncing`, 8% `failed`, 4% `disabled`, 3% `auth_error`. Sync jobs: 80% `completed`, 10% `failed`, 6% `partial`, 4% `retrying`
- **Edge case records to include**: 1 integration with `status: "auth_error"` and note about expired OAuth token; 1 integration with high error rate (14.7%); 1 sync job with `status: "partial"` and note about variant overflow; 1 webhook with 5 delivery attempts and `status: "failed"` (Shopify gave up)
- **ID formats**: integrations `INT-2847`, sync jobs `JOB-94821`, stores `STORE-041`, webhooks `WH-847291`
- **Date patterns**: Sync jobs are continuous — spread across last 7 days, clustered in last 24h for recency. Chart data: 8-12 months of monthly sync volumes with BFCM spike (Nov) and January dip

## Layout Builder Notes

- **Recommended density**: Standard (cards) + Compact (tables). Stat cards at standard padding. Data tables at compact row height (py-2 not py-3).
- **Sidebar width**: Standard 16rem — integration platform names are not long
- **Color**: Shopify-ecosystem green primary — `oklch(0.52 0.13 160)`. This is intentional and recognizable. Do not use blue (that's Celigo), orange, or purple.
- **Border treatment**: Full borders on tables (`border-border`), subdued borders on cards (`border-border/50`). Consistent with Shopify Admin's card treatment.
- **Status badges must be color-coded**: green for `Active`/`Completed`, red for `Failed`/`Auth Error`, amber for `Retrying`/`Partial`, blue for `Syncing`, gray for `Disabled`. This is table-stakes for monitoring tools.
- **Monospace for technical values**: API version strings, webhook IDs, shop domains, payload sizes, latency values — all should render in Geist Mono. This signals developer-grade tooling.
- **No heavy shadows**: Shopify Admin uses very subtle card elevation. Match that. `shadow-sm` maximum.

## Dashboard Builder Notes

- **Primary KPI (largest card)**: Sync Success Rate — this is the #1 health metric operators check first. Show current % + delta vs. last 7 days.
- **Secondary KPIs**: Active Integrations, Orders Synced Today, Avg Sync Latency, Rate Limit Headroom
- **Primary chart type**: Area chart (sync volume over time — 30 days). Show completed vs. failed as stacked or dual-line. This is the standard pattern for integration monitoring tools.
- **Domain-specific panel**: Live sync activity feed — a real-time log of recent sync job completions with integration name, status badge, latency, and "X seconds ago" timestamp. This is the most recognizable element from tools like Celigo, Zapier, and Make. Operators keep this feed visible all day.
- **Secondary chart**: Bar chart of errors by integration — which connector produces the most failures. This is the actionable view.
- **One attention-getter**: Alerts panel — a small list of integrations currently in error/auth_error state with one-click "investigate" action. Even if only 1-2 items, this panel communicates "real-time monitoring."
- **Filter/selector**: Period selector (Today / 7D / 30D) that changes the sync volume chart and the KPI trend deltas. This is table stakes for any ops monitoring dashboard.
