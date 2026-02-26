"use client";

import { useState, useMemo } from "react";
import { integrations, stores } from "@/data/mock-data";
import type { Integration, IntegrationType, Store } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search,
  CreditCard,
  Truck,
  Package,
  Megaphone,
  BarChart2,
  ChevronUp,
  ChevronDown,
  Puzzle,
  AlertCircle,
  Download,
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

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

const storeMap: Record<string, Store> = Object.fromEntries(
  stores.map((s) => [s.id, s])
);

// ─── Type config ─────────────────────────────────────────────────────────────

const typeConfig: Record<
  IntegrationType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  payment: {
    label: "Payment",
    icon: <CreditCard className="w-4 h-4" />,
    color: "text-[color:var(--primary)] bg-[color:var(--primary)]/10",
  },
  shipping: {
    label: "Shipping",
    icon: <Truck className="w-4 h-4" />,
    color: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  inventory: {
    label: "Inventory",
    icon: <Package className="w-4 h-4" />,
    color: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  marketing: {
    label: "Marketing",
    icon: <Megaphone className="w-4 h-4" />,
    color: "text-purple-500 bg-purple-500/10",
  },
  analytics: {
    label: "Analytics",
    icon: <BarChart2 className="w-4 h-4" />,
    color: "text-sky-500 bg-sky-500/10",
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function IntegrationStatusBadge({ status }: { status: Integration["status"] }) {
  const config = {
    active: {
      label: "Active",
      className: "bg-[color:var(--success)]/10 text-[color:var(--success)] border-0",
    },
    paused: {
      label: "Paused",
      className: "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border-0",
    },
    error: {
      label: "Error",
      className: "bg-destructive/10 text-destructive border-0",
    },
    setup: {
      label: "Setup",
      className: "bg-[color:var(--primary)]/10 text-[color:var(--primary)] border-0",
    },
  }[status];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full", config.className)}
    >
      {config.label}
    </Badge>
  );
}

// ─── Error Rate cell ──────────────────────────────────────────────────────────

function ErrorRateCell({ rate }: { rate: number }) {
  const color =
    rate > 5
      ? "text-destructive"
      : rate > 1
      ? "text-[color:var(--warning)]"
      : "text-[color:var(--success)]";
  return (
    <span className={cn("font-mono text-sm", color)}>
      {rate.toFixed(1)}%
    </span>
  );
}

// ─── Provider Icon Chip ───────────────────────────────────────────────────────

function ProviderChip({ integration }: { integration: Integration }) {
  const tc = typeConfig[integration.type];
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
          tc.color
        )}
      >
        {tc.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{integration.name}</p>
        <p className="text-[11px] text-muted-foreground">{tc.label}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortKey = "name" | "eventsProcessed" | "errorRate" | "lastEvent";
type TypeFilter = IntegrationType | "all";

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("eventsProcessed");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const displayed = useMemo(() => {
    return integrations
      .filter((i) => {
        const matchesSearch =
          search === "" ||
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.provider.toLowerCase().includes(search.toLowerCase()) ||
          (storeMap[i.storeId]?.name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesType = typeFilter === "all" || i.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let av: string | number = a[sortKey];
        let bv: string | number = b[sortKey];
        if (typeof av === "string" && typeof bv === "string") {
          av = av.toLowerCase();
          bv = bv.toLowerCase();
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, typeFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const typeFilters: { value: TypeFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "payment", label: "Payment" },
    { value: "shipping", label: "Shipping" },
    { value: "inventory", label: "Inventory" },
    { value: "marketing", label: "Marketing" },
    { value: "analytics", label: "Analytics" },
  ];

  const columns: { key: SortKey; label: string; sortable: boolean }[] = [
    { key: "name", label: "Provider", sortable: true },
    { key: "eventsProcessed", label: "Events (30d)", sortable: true },
    { key: "errorRate", label: "Error Rate", sortable: true },
    { key: "lastEvent", label: "Last Event", sortable: true },
  ];

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All third-party service connections across your stores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm">
            <Puzzle className="w-4 h-4 mr-1.5" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations by provider or store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-100 border",
                typeFilter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length}{" "}
          {displayed.length === 1 ? "integration" : "integrations"}
        </span>
      </div>

      {/* Table */}
      <Card className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "bg-muted/50 text-xs font-medium text-muted-foreground whitespace-nowrap",
                      col.sortable &&
                        "cursor-pointer select-none hover:text-foreground transition-colors duration-100"
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Store
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No integrations match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((int) => {
                  const store = storeMap[int.storeId];
                  return (
                    <TableRow
                      key={int.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                    >
                      <TableCell className="py-3">
                        <ProviderChip integration={int} />
                      </TableCell>
                      <TableCell className="py-3 font-mono text-sm tabular-nums text-right">
                        {formatCount(int.eventsProcessed)}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <ErrorRateCell rate={int.errorRate} />
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(int.lastEvent)}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm">{store?.name ?? "—"}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {store?.domain ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col gap-1">
                          <IntegrationStatusBadge status={int.status} />
                          {int.status === "error" && int.errorMessage && (
                            <div className="flex items-start gap-1 mt-1 max-w-[200px]">
                              <AlertCircle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />
                              <p className="text-[11px] text-destructive leading-tight">
                                {int.errorMessage}
                              </p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
