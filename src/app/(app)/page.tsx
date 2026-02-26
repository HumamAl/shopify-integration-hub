"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Store,
  Plug,
  ShoppingCart,
  Package,
  Webhook,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  dashboardStats,
  revenueByMonth,
  syncJobs,
} from "@/data/mock-data";
import type { SyncJob, SyncJobType, SyncJobStatus } from "@/lib/types";

// ── SSR-safe chart import ────────────────────────────────────────────────────
const GmvChart = dynamic(
  () => import("@/components/dashboard/gmv-chart").then((m) => m.GmvChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />
    ),
  }
);

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(end: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

// ── Sync job filter types ────────────────────────────────────────────────────
type FilterType = "all" | SyncJobType;

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All Jobs" },
  { value: "products", label: "Products" },
  { value: "orders", label: "Orders" },
  { value: "inventory", label: "Inventory" },
  { value: "customers", label: "Customers" },
];

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: SyncJobStatus }) {
  const config: Record<SyncJobStatus, { label: string; className: string; icon: React.ReactNode }> = {
    completed: {
      label: "Completed",
      className: "bg-[color:var(--success)]/10 text-[color:var(--success)]",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    failed: {
      label: "Failed",
      className: "bg-destructive/10 text-destructive",
      icon: <XCircle className="w-3 h-3" />,
    },
    running: {
      label: "Running",
      className: "bg-primary/10 text-primary",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    queued: {
      label: "Queued",
      className: "bg-muted text-muted-foreground",
      icon: <Clock className="w-3 h-3" />,
    },
    partial: {
      label: "Partial",
      className: "bg-[color:var(--warning)]/10 text-[color:var(--warning)]",
      icon: <AlertCircle className="w-3 h-3" />,
    },
  };

  const { label, className, icon } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}

// ── Stat card component ──────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  format: "integer" | "currency" | "percentage";
  suffix?: string;
  icon: React.ReactNode;
  index: number;
}

function StatCard({ title, value, change, format, suffix, icon, index }: StatCardProps) {
  const { count, ref } = useCountUp(value);

  const displayValue = useMemo(() => {
    if (format === "currency") {
      if (count >= 1_000_000) return `$${(count / 1_000_000).toFixed(2)}M`;
      if (count >= 1_000) return `$${(count / 1_000).toFixed(0)}K`;
      return `$${count}`;
    }
    if (format === "percentage") return `${(count / 10).toFixed(1)}%`;
    return count.toLocaleString();
  }, [count, format]);

  // For percentages the raw value is stored as integer * 10 to allow countUp to work
  const finalDisplay = useMemo(() => {
    if (format === "percentage") {
      // value was passed as e.g. 964 to represent 96.4
      return `${(value / 10).toFixed(1)}%`;
    }
    if (format === "currency") {
      if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
      if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
      return `$${value}`;
    }
    return value.toLocaleString();
  }, [value, format]);

  const displayForAnimation = format === "percentage" ? displayValue : displayValue;
  const isPositive = change >= 0;

  return (
    <div
      ref={ref}
      className="aesthetic-card p-5 flex flex-col gap-3 animate-fade-up-in"
      style={{
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold font-mono tabular-nums text-foreground tracking-tight">
          {count === value ? finalDisplay : displayForAnimation}
          {suffix && <span className="text-base font-normal text-muted-foreground ml-1">{suffix}</span>}
        </p>
        <p className={cn("text-xs mt-1 flex items-center gap-0.5", isPositive ? "text-[color:var(--success)]" : "text-destructive")}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {isPositive ? "+" : ""}{change.toFixed(1)}% vs last 30 days
        </p>
      </div>
    </div>
  );
}

// ── Duration formatter ───────────────────────────────────────────────────────
function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

// ── Sync type label map ──────────────────────────────────────────────────────
const TYPE_LABELS: Record<SyncJobType, string> = {
  products: "Products",
  orders: "Orders",
  inventory: "Inventory",
  customers: "Customers",
};

// ── Main dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [syncFilter, setSyncFilter] = useState<FilterType>("all");

  const filteredJobs = useMemo<SyncJob[]>(() => {
    const sorted = [...syncJobs].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    const filtered =
      syncFilter === "all" ? sorted : sorted.filter((j) => j.type === syncFilter);
    return filtered.slice(0, 8);
  }, [syncFilter]);

  // KPI stat definitions
  const stats: StatCardProps[] = [
    {
      title: "Connected Stores",
      value: dashboardStats.connectedStores,
      change: dashboardStats.storesChange,
      format: "integer",
      icon: <Store className="w-4 h-4" />,
      index: 0,
    },
    {
      title: "Active Integrations",
      value: dashboardStats.activeIntegrations,
      change: dashboardStats.integrationsChange,
      format: "integer",
      icon: <Plug className="w-4 h-4" />,
      index: 1,
    },
    {
      title: "Orders Processed",
      value: dashboardStats.ordersProcessed,
      change: dashboardStats.ordersChange,
      format: "integer",
      icon: <ShoppingCart className="w-4 h-4" />,
      index: 2,
    },
    {
      title: "Products Synced",
      value: dashboardStats.productsSynced,
      change: dashboardStats.productsSyncedChange,
      format: "integer",
      icon: <Package className="w-4 h-4" />,
      index: 3,
    },
    {
      title: "Webhook Delivery Rate",
      // Store as integer * 10 for smooth countUp animation on decimal values
      value: Math.round(dashboardStats.webhookDeliveryRate * 10),
      change: dashboardStats.webhookRateChange,
      format: "percentage",
      icon: <Webhook className="w-4 h-4" />,
      index: 4,
    },
    {
      title: "Total GMV (30d)",
      value: dashboardStats.totalGmv,
      change: dashboardStats.gmvChange,
      format: "currency",
      icon: <TrendingUp className="w-4 h-4" />,
      index: 5,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integration Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time sync health, GMV flow, and store activity across all connected Shopify stores.
        </p>
      </div>

      {/* ── KPI stat cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* ── GMV trend chart ──────────────────────────────────────────────── */}
      <div className="aesthetic-card overflow-hidden">
        <div className="px-6 pt-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold">GMV &amp; Order Volume</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gross Merchandise Value processed through all store integrations · Last 12 months
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: "var(--chart-1)" }} />
              GMV (left axis)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: "var(--chart-2)" }} />
              Orders (right axis)
            </span>
          </div>
        </div>
        <div className="px-2 pb-5">
          <GmvChart data={revenueByMonth} />
        </div>
      </div>

      {/* ── Sync activity table ──────────────────────────────────────────── */}
      <div className="aesthetic-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Recent Sync Jobs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest data synchronization runs across all connected stores
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSyncFilter(opt.value)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors",
                  "duration-[var(--dur-fast)]",
                  syncFilter === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border/60">
                <th className="px-6 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Store
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Items Synced
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Failed
                </th>
                <th className="px-6 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No sync jobs found for this filter.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="aesthetic-hover transition-colors duration-[var(--dur-fast)]"
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium text-foreground truncate max-w-[180px]">
                        {job.storeName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {new Date(job.startedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{TYPE_LABELS[job.type]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                      {job.itemsSynced.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      <span
                        className={
                          job.itemsFailed > 0 ? "text-destructive" : "text-muted-foreground"
                        }
                      >
                        {job.itemsFailed > 0 ? job.itemsFailed.toLocaleString() : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-sm text-muted-foreground">
                      {formatDuration(job.duration)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Proposal banner ──────────────────────────────────────────────── */}
      <div className="aesthetic-card p-4 border-primary/15 bg-gradient-to-r from-primary/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">
            This is a live demo built for{" "}
            {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-[var(--dur-fast)]"
          >
            My approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors duration-[var(--dur-fast)]"
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
