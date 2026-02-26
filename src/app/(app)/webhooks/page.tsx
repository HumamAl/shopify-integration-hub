"use client";

import { useState, useMemo } from "react";
import { webhookEvents } from "@/data/mock-data";
import type { WebhookEvent, WebhookStatus, WebhookTopic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Package,
  Truck,
  Boxes,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  ChevronDown,
  Activity,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Topic config — category, color, icon ────────────────────────────────────

type TopicCategory = "orders" | "products" | "fulfillments" | "inventory" | "customers" | "other";

const topicCategoryMap: Record<WebhookTopic, TopicCategory> = {
  "orders/create": "orders",
  "orders/updated": "orders",
  "orders/cancelled": "orders",
  "products/create": "products",
  "products/update": "products",
  "fulfillments/create": "fulfillments",
  "inventory_levels/update": "inventory",
  "customers/create": "customers",
  "refunds/create": "orders",
  "app/uninstalled": "other",
};

const categoryConfig: Record<
  TopicCategory,
  { color: string; bgColor: string; icon: React.ReactNode }
> = {
  orders: {
    color: "text-[color:var(--primary)]",
    bgColor: "bg-[color:var(--primary)]/10",
    icon: <ShoppingCart className="w-3.5 h-3.5" />,
  },
  products: {
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    icon: <Package className="w-3.5 h-3.5" />,
  },
  fulfillments: {
    color: "text-[color:var(--success)]",
    bgColor: "bg-[color:var(--success)]/10",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  inventory: {
    color: "text-[color:var(--warning)]",
    bgColor: "bg-[color:var(--warning)]/10",
    icon: <Boxes className="w-3.5 h-3.5" />,
  },
  customers: {
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  other: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    icon: <Activity className="w-3.5 h-3.5" />,
  },
};

// ─── Topic Badge ──────────────────────────────────────────────────────────────

function TopicBadge({ topic }: { topic: WebhookTopic }) {
  const category = topicCategoryMap[topic];
  const cc = categoryConfig[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium font-mono",
        cc.bgColor,
        cc.color
      )}
    >
      {cc.icon}
      {topic}
    </span>
  );
}

// ─── Status config ────────────────────────────────────────────────────────────

function WebhookStatusIndicator({ status }: { status: WebhookStatus }) {
  const config: Record<
    WebhookStatus,
    { icon: React.ReactNode; label: string; className: string }
  > = {
    delivered: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Delivered",
      className: "text-[color:var(--success)]",
    },
    failed: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Failed",
      className: "text-destructive",
    },
    pending: {
      icon: <Clock className="w-4 h-4" />,
      label: "Pending",
      className: "text-muted-foreground",
    },
    retrying: {
      icon: <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: "2s" }} />,
      label: "Retrying",
      className: "text-[color:var(--warning)]",
    },
  };

  const c = config[status];
  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-medium", c.className)}>
      {c.icon}
      {c.label}
    </div>
  );
}

// ─── Response Code Badge ──────────────────────────────────────────────────────

function ResponseCodeBadge({ code }: { code?: number }) {
  if (!code) return null;
  const isError = code >= 400;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-mono rounded-full border-0 px-2",
        isError
          ? "bg-destructive/10 text-destructive"
          : "bg-[color:var(--success)]/10 text-[color:var(--success)]"
      )}
    >
      HTTP {code}
    </Badge>
  );
}

// ─── Webhook Event Row ────────────────────────────────────────────────────────

function WebhookEventRow({ event }: { event: WebhookEvent }) {
  const [expanded, setExpanded] = useState(false);
  const hasError = event.status === "failed" || event.status === "retrying";

  return (
    <div
      className={cn(
        "border-b border-border/40 last:border-b-0 transition-colors duration-100",
        hasError && "cursor-pointer"
      )}
      onClick={() => {
        if (hasError) setExpanded((e) => !e);
      }}
    >
      <div className="flex items-start gap-3 px-4 py-3 hover:bg-[color:var(--surface-hover)] transition-colors duration-100">
        {/* Status indicator dot */}
        <div className="mt-0.5 shrink-0">
          <WebhookStatusIndicator status={event.status} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <TopicBadge topic={event.topic} />
            <span className="text-xs text-muted-foreground font-medium">{event.storeName}</span>
          </div>
          <p className="text-sm text-foreground leading-snug">{event.payloadSummary}</p>
          {hasError && event.errorCode && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] font-mono text-destructive bg-destructive/5 px-1.5 py-0.5 rounded">
                {event.errorCode}
              </span>
              <ResponseCodeBadge code={event.responseCode} />
            </div>
          )}
        </div>

        {/* Right metadata */}
        <div className="shrink-0 text-right flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(event.receivedAt)}
          </span>
          <span className="text-[11px] text-muted-foreground/70">
            {event.attempts === 1
              ? "1 attempt"
              : `${event.attempts} attempts`}
          </span>
          {hasError && (
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground transition-transform duration-100",
                expanded && "rotate-180"
              )}
            />
          )}
        </div>
      </div>

      {/* Expanded error detail */}
      {expanded && hasError && (
        <div className="px-4 pb-3 pt-0 ml-8 bg-muted/20">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-destructive mb-1">
                Delivery Failure — {event.errorCode}
              </p>
              <div className="space-y-0.5 text-[11px] text-muted-foreground">
                <p>Event ID: <span className="font-mono">{event.id}</span></p>
                <p>Received: {new Date(event.receivedAt).toLocaleString("en-US")}</p>
                <p>Attempts: {event.attempts} / 5</p>
                {event.responseCode && (
                  <p>Last response: HTTP {event.responseCode}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type StatusFilter = WebhookStatus | "all";

export default function WebhooksPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [topicFilter, setTopicFilter] = useState<TopicCategory | "all">("all");

  const displayed = useMemo(() => {
    return webhookEvents
      .filter((e) => {
        const matchesStatus = statusFilter === "all" || e.status === statusFilter;
        const matchesTopic =
          topicFilter === "all" ||
          topicCategoryMap[e.topic] === topicFilter;
        return matchesStatus && matchesTopic;
      })
      .sort(
        (a, b) =>
          new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
  }, [statusFilter, topicFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: webhookEvents.length };
    for (const e of webhookEvents) {
      counts[e.status] = (counts[e.status] ?? 0) + 1;
    }
    return counts;
  }, []);

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Events" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "pending", label: "Pending" },
    { value: "retrying", label: "Retrying" },
  ];

  const topicFilters: { value: TopicCategory | "all"; label: string }[] = [
    { value: "all", label: "All Topics" },
    { value: "orders", label: "Orders" },
    { value: "products", label: "Products" },
    { value: "fulfillments", label: "Fulfillments" },
    { value: "inventory", label: "Inventory" },
    { value: "customers", label: "Customers" },
  ];

  const deliveryRate = useMemo(() => {
    const delivered = webhookEvents.filter((e) => e.status === "delivered").length;
    return webhookEvents.length > 0
      ? ((delivered / webhookEvents.length) * 100).toFixed(1)
      : "0.0";
  }, []);

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webhook Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time event feed from all connected Shopify stores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Delivery Rate</p>
            <p className="text-lg font-bold font-mono text-[color:var(--success)]">
              {deliveryRate}%
            </p>
          </div>
          <Button size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-100 border",
              statusFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
            )}
          >
            {f.label}
            {statusCounts[f.value] !== undefined && (
              <span
                className={cn(
                  "ml-1.5 text-[10px]",
                  statusFilter === f.value
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground/60"
                )}
              >
                {statusCounts[f.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Topic filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground shrink-0">Topic:</span>
        {topicFilters.map((f) => {
          const cc = f.value !== "all" ? categoryConfig[f.value] : null;
          return (
            <button
              key={f.value}
              onClick={() => setTopicFilter(f.value)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-100 border flex items-center gap-1.5",
                topicFilter === f.value
                  ? cc
                    ? `${cc.bgColor} ${cc.color} border-transparent`
                    : "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
              )}
            >
              {cc && <span>{cc.icon}</span>}
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-muted-foreground">
          {displayed.length} {displayed.length === 1 ? "event" : "events"}
        </span>
      </div>

      {/* Event feed */}
      <Card className="aesthetic-card p-0 overflow-hidden">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No webhook events match this filter
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Try adjusting the status or topic filter.
            </p>
          </div>
        ) : (
          <div>
            {displayed.map((event) => (
              <WebhookEventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
