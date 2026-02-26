"use client";

import { useState, useMemo } from "react";
import { stores, getIntegrationsByStore } from "@/data/mock-data";
import type { Store, Integration } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  Store as StoreIcon,
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Puzzle,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
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

function formatGmv(value: number): string {
  if (value === 0) return "$0";
  return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StoreStatusBadge({ status }: { status: Store["status"] }) {
  const config = {
    connected: {
      label: "Connected",
      className:
        "bg-[color:var(--success)]/10 text-[color:var(--success)] border-0",
      icon: <Wifi className="w-3 h-3" />,
    },
    syncing: {
      label: "Syncing",
      className:
        "bg-[color:var(--primary)]/10 text-[color:var(--primary)] border-0",
      icon: <RefreshCw className="w-3 h-3 animate-spin" />,
    },
    error: {
      label: "Error",
      className: "bg-destructive/10 text-destructive border-0",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    disconnected: {
      label: "Disconnected",
      className: "bg-muted text-muted-foreground border-0",
      icon: <WifiOff className="w-3 h-3" />,
    },
  }[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium rounded-full flex items-center gap-1.5 px-2 py-0.5",
        config.className
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function PlanBadge({ plan }: { plan: Store["plan"] }) {
  const colors: Record<Store["plan"], string> = {
    plus: "bg-[color:var(--primary)]/10 text-[color:var(--primary)] border-0",
    advanced: "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border-0",
    shopify: "bg-muted text-muted-foreground border-0",
    basic: "bg-muted text-muted-foreground border-0",
    starter: "bg-muted text-muted-foreground border-0",
  };
  const labels: Record<Store["plan"], string> = {
    plus: "Shopify Plus",
    advanced: "Advanced",
    shopify: "Shopify",
    basic: "Basic",
    starter: "Starter",
  };
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", colors[plan])}
    >
      {labels[plan]}
    </Badge>
  );
}

// ─── Integration Status mini-badge ───────────────────────────────────────────

function IntegrationStatusDot({ status }: { status: Integration["status"] }) {
  const classes = {
    active: "bg-[color:var(--success)]",
    paused: "bg-[color:var(--warning)]",
    error: "bg-destructive",
    setup: "bg-[color:var(--primary)]",
  }[status];
  return <span className={cn("inline-block w-2 h-2 rounded-full shrink-0", classes)} />;
}

// ─── Expanded Store Detail Panel ──────────────────────────────────────────────

function StoreExpandedPanel({ store }: { store: Store }) {
  const integrations = getIntegrationsByStore(store.id);

  const typeLabels: Record<Integration["type"], string> = {
    payment: "Payment",
    shipping: "Shipping",
    inventory: "Inventory",
    marketing: "Marketing",
    analytics: "Analytics",
  };

  return (
    <div className="border-t border-border/40 px-5 py-4 bg-muted/20">
      {store.errorMessage && (
        <div className="mb-3 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive">{store.errorMessage}</p>
        </div>
      )}
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Active Integrations ({integrations.length})
      </p>
      {integrations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No integrations configured for this store.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {integrations.map((int) => (
            <div
              key={int.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60"
            >
              <div className="flex items-center gap-2 min-w-0">
                <IntegrationStatusDot status={int.status} />
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{int.name}</p>
                  <p className="text-[11px] text-muted-foreground">{typeLabels[int.type]}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-xs font-mono text-muted-foreground">
                  {int.eventsProcessed.toLocaleString()} events
                </p>
                <p
                  className={cn(
                    "text-[11px] font-mono",
                    int.errorRate > 5
                      ? "text-destructive"
                      : int.errorRate > 1
                      ? "text-[color:var(--warning)]"
                      : "text-[color:var(--success)]"
                  )}
                >
                  {int.errorRate.toFixed(1)}% errors
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/40">
        <div>
          <p className="text-[11px] text-muted-foreground">Connected</p>
          <p className="text-xs font-medium">
            {new Date(store.connectedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Timezone</p>
          <p className="text-xs font-medium">{store.timezone.replace("America/", "")}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Currency</p>
          <p className="text-xs font-medium">{store.currency}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Domain</p>
          <p className="text-xs font-medium font-mono truncate">{store.domain}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Store Card ───────────────────────────────────────────────────────────────

function StoreCard({
  store,
  expanded,
  onToggle,
}: {
  store: Store;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={cn(
        "aesthetic-card overflow-hidden cursor-pointer transition-all duration-150",
        expanded && "border-primary/30"
      )}
      onClick={onToggle}
    >
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <StoreIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">{store.name}</h3>
              <p className="text-[11px] text-muted-foreground font-mono truncate">
                {store.domain}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StoreStatusBadge status={store.status} />
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0">
        <div className="flex items-center gap-1.5 mb-3">
          <PlanBadge plan={store.plan} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs font-mono font-medium">
                {formatCount(store.productCount)}
              </p>
              <p className="text-[10px] text-muted-foreground">Products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs font-mono font-medium">
                {formatCount(store.orderCount)}
              </p>
              <p className="text-[10px] text-muted-foreground">Lifetime Orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs font-mono font-medium">
                {formatGmv(store.monthlyGmv)}
              </p>
              <p className="text-[10px] text-muted-foreground">Monthly GMV</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs font-mono font-medium">
                {formatRelativeTime(store.lastSync)}
              </p>
              <p className="text-[10px] text-muted-foreground">Last Sync</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
          <Puzzle className="w-3.5 h-3.5" />
          <span>{getIntegrationsByStore(store.id).length} integration{getIntegrationsByStore(store.id).length !== 1 ? "s" : ""}</span>
          <span className="text-border">·</span>
          <span className="text-primary text-[11px]">
            {expanded ? "Hide details" : "Show integrations"}
          </span>
        </div>
      </CardContent>

      {expanded && (
        <div onClick={(e) => e.stopPropagation()}>
          <StoreExpandedPanel store={store} />
        </div>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StoresPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Store["status"] | "all">("all");

  const displayed = useMemo(() => {
    return stores.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.domain.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: stores.length };
    for (const s of stores) {
      counts[s.status] = (counts[s.status] ?? 0) + 1;
    }
    return counts;
  }, []);

  const statusFilters: { value: Store["status"] | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "connected", label: "Connected" },
    { value: "syncing", label: "Syncing" },
    { value: "error", label: "Error" },
    { value: "disconnected", label: "Disconnected" },
  ];

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Connected Stores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor all Shopify stores connected to IntegrateFlow.
          </p>
        </div>
        <Button size="sm" className="shrink-0">
          <StoreIcon className="w-4 h-4 mr-1.5" />
          Connect Store
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search stores by name or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
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
                    statusFilter === f.value ? "text-primary-foreground/70" : "text-muted-foreground/60"
                  )}
                >
                  {statusCounts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "store" : "stores"}
        </span>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <StoreIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No stores match this filter</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try adjusting your search or status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              expanded={expandedId === store.id}
              onToggle={() =>
                setExpandedId(expandedId === store.id ? null : store.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
