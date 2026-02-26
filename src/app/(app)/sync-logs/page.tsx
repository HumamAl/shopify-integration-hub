"use client";

import { useState, useMemo } from "react";
import { syncJobs } from "@/data/mock-data";
import type { SyncJob, SyncJobStatus, SyncJobType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Package,
  ShoppingCart,
  Users,
  Boxes,
  Clock,
  AlertTriangle,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  Timer,
  GitMerge,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }) + ", " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function SyncStatusBadge({ status }: { status: SyncJobStatus }) {
  const config: Record<
    SyncJobStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    completed: {
      label: "Completed",
      className: "bg-[color:var(--success)]/10 text-[color:var(--success)] border-0",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    running: {
      label: "Running",
      className: "bg-[color:var(--primary)]/10 text-[color:var(--primary)] border-0",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    failed: {
      label: "Failed",
      className: "bg-destructive/10 text-destructive border-0",
      icon: <XCircle className="w-3 h-3" />,
    },
    queued: {
      label: "Queued",
      className: "bg-muted text-muted-foreground border-0",
      icon: <Timer className="w-3 h-3" />,
    },
    partial: {
      label: "Partial",
      className: "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border-0",
      icon: <GitMerge className="w-3 h-3" />,
    },
  };

  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium rounded-full flex items-center gap-1.5 px-2 py-0.5 w-fit",
        c.className
      )}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

// ─── Sync Type Icon ───────────────────────────────────────────────────────────

const typeIcons: Record<SyncJobType, React.ReactNode> = {
  products: <Package className="w-3.5 h-3.5" />,
  orders: <ShoppingCart className="w-3.5 h-3.5" />,
  inventory: <Boxes className="w-3.5 h-3.5" />,
  customers: <Users className="w-3.5 h-3.5" />,
};

const typeLabels: Record<SyncJobType, string> = {
  products: "Products",
  orders: "Orders",
  inventory: "Inventory",
  customers: "Customers",
};

// ─── Trigger Badge ────────────────────────────────────────────────────────────

function TriggerChip({ trigger }: { trigger: SyncJob["triggeredBy"] }) {
  const config = {
    scheduled: { label: "Scheduled", className: "bg-muted text-muted-foreground" },
    manual: { label: "Manual", className: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]" },
    webhook: { label: "Webhook", className: "bg-purple-500/10 text-purple-500" },
  }[trigger];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type StatusFilter = SyncJobStatus | "all";
type SortKey = "startedAt" | "storeName" | "itemsSynced" | "duration";

export default function SyncLogsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("startedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return syncJobs
      .filter((j) => statusFilter === "all" || j.status === statusFilter)
      .sort((a, b) => {
        let av: string | number;
        let bv: string | number;
        if (sortKey === "startedAt") {
          av = a.startedAt;
          bv = b.startedAt;
        } else if (sortKey === "storeName") {
          av = a.storeName.toLowerCase();
          bv = b.storeName.toLowerCase();
        } else if (sortKey === "itemsSynced") {
          av = a.itemsSynced;
          bv = b.itemsSynced;
        } else {
          av = a.duration ?? -1;
          bv = b.duration ?? -1;
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [statusFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Runs" },
    { value: "completed", label: "Completed" },
    { value: "running", label: "Running" },
    { value: "failed", label: "Failed" },
    { value: "queued", label: "Queued" },
    { value: "partial", label: "Partial" },
  ];

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: syncJobs.length };
    for (const j of syncJobs) {
      counts[j.status] = (counts[j.status] ?? 0) + 1;
    }
    return counts;
  }, []);

  const sortableColumns: { key: SortKey; label: string }[] = [
    { key: "startedAt", label: "Started" },
    { key: "storeName", label: "Store" },
    { key: "itemsSynced", label: "Items Synced" },
    { key: "duration", label: "Duration" },
  ];

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sync Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Full history of sync jobs across all connected stores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export Logs
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Trigger Sync
          </Button>
        </div>
      </div>

      {/* Status filter buttons */}
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
        <span className="ml-auto text-sm text-muted-foreground">
          {displayed.length} {displayed.length === 1 ? "job" : "jobs"}
        </span>
      </div>

      {/* Table */}
      <Card className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Type
                </TableHead>
                {sortableColumns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-100 whitespace-nowrap"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right">
                  Items Synced / Failed
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Trigger
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
                    colSpan={8}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No sync jobs match this status filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((job) => (
                  <>
                    <TableRow
                      key={job.id}
                      className={cn(
                        "hover:bg-[color:var(--surface-hover)] transition-colors duration-100",
                        (job.status === "failed" || job.status === "partial") &&
                          job.failureReason &&
                          "cursor-pointer"
                      )}
                      onClick={() => {
                        if (
                          (job.status === "failed" || job.status === "partial") &&
                          job.failureReason
                        ) {
                          setExpandedId(expandedId === job.id ? null : job.id);
                        }
                      }}
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {typeIcons[job.type]}
                          <span className="text-sm">{typeLabels[job.type]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDateTime(job.startedAt)}
                      </TableCell>
                      <TableCell className="py-3">
                        <p className="text-sm font-medium">{job.storeName}</p>
                      </TableCell>
                      <TableCell className="py-3 font-mono text-sm tabular-nums text-right">
                        {formatCount(job.itemsSynced)}
                      </TableCell>
                      <TableCell className="py-3 font-mono text-sm text-muted-foreground text-right">
                        {formatDuration(job.duration)}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2 font-mono text-sm tabular-nums">
                          <span className="text-[color:var(--success)]">
                            {formatCount(job.itemsSynced)}
                          </span>
                          {job.itemsFailed > 0 && (
                            <>
                              <span className="text-muted-foreground/40">/</span>
                              <span className="text-destructive">
                                {formatCount(job.itemsFailed)} failed
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <TriggerChip trigger={job.triggeredBy} />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <SyncStatusBadge status={job.status} />
                          {(job.status === "failed" || job.status === "partial") &&
                            job.failureReason && (
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 text-muted-foreground transition-transform duration-100",
                                  expandedId === job.id && "rotate-180"
                                )}
                              />
                            )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded failure reason */}
                    {expandedId === job.id && job.failureReason && (
                      <TableRow key={`${job.id}-expanded`}>
                        <TableCell colSpan={8} className="bg-muted/20 px-4 py-3">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                                Failure Reason
                              </p>
                              <p className="text-sm text-foreground">
                                {job.failureReason}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Started: {formatDateTime(job.startedAt)}
                                </span>
                                {job.completedAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Ended: {formatDateTime(job.completedAt)}
                                  </span>
                                )}
                                {job.duration !== null && (
                                  <span>Duration: {formatDuration(job.duration)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
