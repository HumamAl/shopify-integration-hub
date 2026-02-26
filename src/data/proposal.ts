import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline: "Full-stack developer who builds marketplaces and e-commerce tools — listings, payments, vendor management, the works.",
  bio: "I build integration platforms and e-commerce tools that handle real merchant operations — Shopify API pipelines, multi-store sync, webhook processing, and admin dashboards. My approach: understand the integration points, build something merchants can actually trust with their data, and ship it fast.",
  approach: [
    {
      title: "Map the Integration Points",
      description: "Audit which Shopify APIs, webhooks, and third-party services need to talk to each other — find the data flow gaps before writing code",
    },
    {
      title: "Build the Sync Engine",
      description: "Core infrastructure first — reliable data sync with rate limit handling, retry logic, and conflict resolution across stores",
    },
    {
      title: "Ship the Merchant Dashboard",
      description: "Merchants need visibility into what's syncing, what's broken, and what needs attention — not just backend plumbing",
    },
    {
      title: "Harden Under Load",
      description: "Stress-test during simulated peak traffic (BFCM scenarios), fix the edge cases, then scale",
    },
  ],
  skillCategories: [
    {
      name: "Frontend",
      skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui", "Recharts"],
    },
    {
      name: "APIs & Integrations",
      skills: ["Shopify API", "REST APIs", "Webhooks", "Stripe", "Node.js"],
    },
    {
      name: "E-Commerce",
      skills: ["Shopify", "Multi-store Sync", "Inventory Management", "Order Processing"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "ai-store-builder",
    title: "AI Store Builder",
    description: "AI-powered Shopify store page generator — wizard-based flow producing ready-to-use store layouts, product descriptions, and branding from a brief",
    tech: ["Next.js", "TypeScript", "Shopify", "AI Pipeline"],
    relevance: "Direct Shopify integration experience with store page generation and template systems",
    outcome: "Multi-step wizard UI that walks through brand inputs and generates a complete store page layout with AI-written copy",
  },
  {
    id: "lynt-marketplace",
    title: "Lynt Marketplace",
    description: "Full marketplace platform with vendor onboarding, listing management, and transaction tracking",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    relevance: "Multi-vendor e-commerce architecture with product catalogs and order management",
    outcome: "Full marketplace architecture — vendor onboarding, listing management, and transaction tracking ready for production",
    liveUrl: "https://lynt-marketplace.vercel.app",
  },
  {
    id: "data-intelligence",
    title: "Data Intelligence Platform",
    description: "Multi-source data aggregation dashboard with interactive charts, filterable insights, and cross-platform analytics",
    tech: ["Next.js", "TypeScript", "Recharts", "REST APIs"],
    relevance: "Multi-source integration and data normalization — same pattern as syncing across Shopify stores and third-party services",
    outcome: "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
  },
  {
    id: "wmf-agent",
    title: "WMF Agent Dashboard",
    description: "AI-powered email classification, RFQ extraction, and human-in-the-loop approval workflow for manufacturing",
    tech: ["Next.js", "Claude API", "n8n", "Microsoft Graph"],
    relevance: "API integration pipeline with webhook processing and automated data extraction",
    outcome: "Replaced a 4-hour manual quote review with 20-minute structured extraction and approval flow",
    liveUrl: "https://wmf-agent-dashboard.vercel.app",
  },
];
