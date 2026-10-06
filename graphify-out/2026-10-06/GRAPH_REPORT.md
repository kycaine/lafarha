# Graph Report - LA  (2026-10-06)

## Corpus Check
- 92 files · ~298,913 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 383 nodes · 402 edges · 50 communities (32 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac31047c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UI Components & Home Page
- ESLint Configuration
- Path Aliases Configuration
- Admin Dashboard Pages
- API Worker Dependencies
- TypeScript Compiler Setup
- UI Component Dependencies
- Admin Products & Penawaran Pages
- API Worker TypeScript Config
- Next.js Types Reference
- App Layout & Metadata
- API Worker App Entry
- Cloudflare Env Types
- ESLint Config Instance
- Next.js Configuration
- PostCSS Configuration
- ProductCatalog.tsx
- middleware.ts
- page.tsx
- page.tsx
- patch.js
- Universal Project Bootstrap & Agent Orchestration Guide
- page.tsx
- next.config.mjs
- route.ts
- DELETE
- GET
- OPTIONS
- PATCH
- POST
- PUT
- ServiceSection.tsx
- BaggageModule.tsx
- FlightLogicModule.tsx
- TransportModule.tsx
- VisaModule.tsx
- build-pages.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 37 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 15 edges
4. `Cloudflare Deployment & Environment Guide` - 9 edges
5. `compilerOptions` - 9 edges
6. `include` - 7 edges
7. `Universal Project Bootstrap & Agent Orchestration Guide` - 6 edges
8. `tailwind` - 6 edges
9. `aliases` - 6 edges
10. `getTransactionById()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `QuotePageContent()` --calls--> `getTransactionById()`  [EXTRACTED]
  src/app/quote/page.tsx → src/modules/ordering/actions.ts
- `Card()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (50 total, 18 thin omitted)

### Community 0 - "UI Components & Home Page"
Cohesion: 0.09
Nodes (30): Button(), buttonVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+22 more)

### Community 1 - "ESLint Configuration"
Cohesion: 0.09
Nodes (23): @cloudflare/next-on-pages, concurrently, eslint, eslint-config-next, devDependencies, @cloudflare/next-on-pages, concurrently, eslint (+15 more)

### Community 2 - "Path Aliases Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 3 - "Admin Dashboard Pages"
Cohesion: 0.19
Nodes (13): AdminDashboard(), STATUS_COLORS, STATUS_LABELS, QuotePageContent(), getTransactionById(), getTransactions(), issueOrder(), updateOrderContact() (+5 more)

### Community 4 - "API Worker Dependencies"
Cohesion: 0.10
Nodes (20): author, dependencies, hono, description, devDependencies, @cloudflare/workers-types, typescript, wrangler (+12 more)

### Community 5 - "TypeScript Compiler Setup"
Cohesion: 0.10
Nodes (21): dom, dom.iterable, esnext, ./src/*, compilerOptions, allowJs, esModuleInterop, incremental (+13 more)

### Community 6 - "UI Component Dependencies"
Cohesion: 0.06
Nodes (31): @base-ui/react, class-variance-authority, clsx, firebase, html2canvas-pro, iron-session, jspdf, lucide-react (+23 more)

### Community 7 - "Admin Products & Penawaran Pages"
Cohesion: 0.10
Nodes (4): IconComp, NAV_LINKS, metadata, getMitra()

### Community 8 - "API Worker TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, jsxImportSource, lib, module, moduleResolution, strict, target (+3 more)

### Community 9 - "Next.js Types Reference"
Cohesion: 0.18
Nodes (10): api-worker, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+2 more)

### Community 10 - "App Layout & Metadata"
Cohesion: 0.29
Nodes (5): caveat, cinzel, inter, metadata, playfair

### Community 11 - "API Worker App Entry"
Cohesion: 0.40
Nodes (3): app, Bindings, MITRA_WRITE_ROLES

### Community 14 - "Next.js Configuration"
Cohesion: 0.11
Nodes (18): name, private, scripts, build, build:dev, build:prod, db:init-dev, db:init-local (+10 more)

### Community 17 - "ProductCatalog.tsx"
Cohesion: 0.15
Nodes (9): HOTEL_OPTIONS, HotelSpecsModuleComponent(), DEFAULT_MODULE_SPECS, ICON_MAP, PackageBuilder(), HOTEL_OPTIONS, ICON_MAP, ModuleSpecs (+1 more)

### Community 18 - "middleware.ts"
Cohesion: 0.50
Nodes (4): config, middleware(), Role, ROUTE_RULES

### Community 21 - "patch.js"
Cohesion: 0.18
Nodes (10): Arsitektur 3 Environment, Cloudflare Deployment & Environment Guide, Deploy Dev, Deploy Prod, Local Development, Manajemen Database, Prinsip "Tanpa Gap", Setup Secret (sekali, atau saat rotasi) (+2 more)

### Community 25 - "Universal Project Bootstrap & Agent Orchestration Guide"
Cohesion: 0.29
Nodes (6): 1. Global Registry Reference, 2. Dynamic Tech Stack & Rule Resolution, 3. Just-In-Time (JIT) Skill & Agent Discovery, 4. Execution Workflow, 5. Custom Workspace Commands, Universal Project Bootstrap & Agent Orchestration Guide

### Community 28 - "page.tsx"
Cohesion: 0.22
Nodes (9): dump, localFile(), remoteQuery(), ROOT, rows, SMALL_TABLES, TMP_DIR, WORKER_DIR (+1 more)

### Community 31 - "route.ts"
Cohesion: 0.48
Nodes (5): handleProxy(), RETRYABLE_STATUS, getSession(), getSessionOptions(), SessionData

## Knowledge Gaps
- **168 isolated node(s):** `Arsitektur 3 Environment`, `Template file env`, `Setup Secret (sekali, atau saat rotasi)`, `Manajemen Database`, `Local Development` (+163 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `UI Component Dependencies` to `Next.js Configuration`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `ESLint Configuration` to `Next.js Configuration`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `Arsitektur 3 Environment`, `Template file env`, `Setup Secret (sekali, atau saat rotasi)` to the rest of the system?**
  _168 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Home Page` be split into smaller, more focused modules?**
  _Cohesion score 0.08970099667774087 - nodes in this community are weakly interconnected._
- **Should `ESLint Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Path Aliases Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `API Worker Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._