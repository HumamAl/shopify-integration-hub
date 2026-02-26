"use client";

import Link from "next/link";
import { useState } from "react";
import { challenges, executiveSummary } from "@/data/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { FlowDiagram } from "@/components/challenges/flow-diagram";
import { MetricBar } from "@/components/challenges/metric-bar";
import { BeforeAfter } from "@/components/challenges/before-after";
import { Store, RefreshCw, GitMerge, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

function SyncFlowVisualization() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: "Store A Update", description: "Product inventory changes", icon: Store },
    { label: "Event Queue", description: "Ordered, deduplicated", icon: RefreshCw, highlight: true },
    { label: "Conflict Resolution", description: "Last-write-wins + merge", icon: GitMerge, highlight: true },
    { label: "All Stores Synced", description: "Consistent state", icon: CheckCircle },
  ];

  return (
    <div className="space-y-4">
      <FlowDiagram steps={steps} />
      <div className="flex gap-2">
        {["Detect Change", "Queue Event", "Resolve Conflicts", "Propagate"].map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveStep(i)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              activeStep === i
                ? "bg-primary/10 border-primary/40 text-primary font-medium"
                : "border-border/60 text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {activeStep === 0 && "Shopify webhooks trigger on product/inventory changes. Each store emits events independently."}
        {activeStep === 1 && "Events are queued with deduplication — prevents duplicate syncs when multiple stores update the same SKU."}
        {activeStep === 2 && "When two stores edit the same product simultaneously, the conflict resolver applies last-write-wins with field-level merging."}
        {activeStep === 3 && "Resolved state propagates to all connected stores via batched API calls within rate limits."}
      </p>
    </div>
  );
}

function RateLimitVisualization() {
  return (
    <div className="space-y-3">
      <MetricBar label="Standard REST API" value={40} max={40} unit=" req/s" color="green" />
      <MetricBar label="Peak BFCM Load" value={120} max={200} unit=" req/s" color="red" />
      <MetricBar label="With Priority Queue" value={38} max={40} unit=" req/s" color="green" />
      <MetricBar label="Queue Overflow Buffer" value={82} max={200} unit=" deferred" color="yellow" />
      <p className="text-xs text-muted-foreground pt-1">
        Priority-based queuing keeps critical operations (orders, payments) under the rate limit while deferring bulk syncs to off-peak windows.
      </p>
    </div>
  );
}

function WebhookReliabilityVisualization() {
  return (
    <BeforeAfter
      before={{
        label: "Without Reliability Layer",
        items: [
          "Missed webhooks during downtime",
          "Duplicate processing on retries",
          "No visibility into failed events",
          "Manual reconciliation required",
        ],
      }}
      after={{
        label: "With Delivery Guarantee",
        items: [
          "Dead-letter queue catches every failure",
          "Idempotent handlers prevent duplicates",
          "Real-time webhook status dashboard",
          "Automatic retry with exponential backoff",
        ],
      }}
    />
  );
}

const visualizations: Record<string, React.ReactNode> = {
  "multi-store-sync": <SyncFlowVisualization />,
  "api-rate-resilience": <RateLimitVisualization />,
  "webhook-reliability": <WebhookReliabilityVisualization />,
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I&apos;d architect a Shopify integration platform that stays reliable at scale
          </p>
        </div>

        <div
          className="rounded-lg p-5 space-y-3"
          style={{ background: "var(--section-dark)" }}
        >
          <Link
            href="/"
            className="text-xs text-white/50 hover:text-white/80 transition-colors duration-100"
          >
            &larr; Back to the live demo
          </Link>
          <p className="text-sm leading-relaxed text-white/80">
            {executiveSummary}
          </p>
        </div>

        <div className="space-y-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              outcome={challenge.outcome}
            >
              {visualizations[challenge.id] || (
                <div className="h-32 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-sm text-muted-foreground">
                  {challenge.visualizationType} visualization
                </div>
              )}
            </ChallengeCard>
          ))}
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold">Ready to discuss the approach?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Let&apos;s walk through how these solutions apply to your specific integration requirements.
            </p>
          </div>
          <Link
            href="/proposal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-100 shrink-0"
          >
            Work With Me &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
