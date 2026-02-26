"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { RevenueData } from "@/lib/types";

function formatGmv(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

interface TooltipEntry {
  value: number;
  color: string;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const gmv = payload[0]?.value as number;
  const orders = payload[1]?.value as number;
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3 text-sm shadow-md">
      <p className="font-semibold mb-1.5 text-foreground">{label}</p>
      <div className="space-y-1">
        <p className="text-muted-foreground flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: "var(--chart-1)" }}
          />
          GMV:{" "}
          <span className="font-mono font-semibold text-foreground">
            {formatGmv(gmv)}
          </span>
        </p>
        <p className="text-muted-foreground flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: "var(--chart-2)" }}
          />
          Orders:{" "}
          <span className="font-mono font-semibold text-foreground">
            {orders?.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
};

export function GmvChart({ data }: { data: RevenueData[] }) {
  const chartData = data.map((d) => ({
    month: d.month,
    gmv: d.gmv,
    orders: d.orders,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="fillGmv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          dy={4}
        />
        <YAxis
          yAxisId="gmv"
          tickFormatter={(v: number) => formatGmv(v)}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <YAxis
          yAxisId="orders"
          orientation="right"
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          yAxisId="gmv"
          type="monotone"
          dataKey="gmv"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillGmv)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 0 }}
        />
        <Area
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          fill="url(#fillOrders)"
          dot={false}
          activeDot={{ r: 3, fill: "var(--chart-2)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
