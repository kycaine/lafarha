# Graph Report - LA  (2026-10-02)

## Corpus Check
- 87 files · ~294,600 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 332 nodes · 370 edges · 40 communities (25 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4f5c4f1`
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
- DELETE
- GET
- OPTIONS
- PATCH
- POST
- PUT

## God Nodes (most connected - your core abstractions)
1. `cn()` - 37 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 14 edges
4. `compilerOptions` - 9 edges
5. `include` - 7 edges
6. `Universal Project Bootstrap & Agent Orchestration Guide` - 6 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `fetchApi()` - 6 edges
10. `Button()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ProductCatalog()` --references--> `jspdf`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalog.tsx → package.json
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `Card()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (40 total, 15 thin omitted)

### Community 0 - "UI Components & Home Page"
Cohesion: 0.11
Nodes (23): Button(), buttonVariants, DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle() (+15 more)

### Community 1 - "ESLint Configuration"
Cohesion: 0.09
Nodes (23): @cloudflare/next-on-pages, concurrently, eslint, eslint-config-next, devDependencies, @cloudflare/next-on-pages, concurrently, eslint (+15 more)

### Community 2 - "Path Aliases Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 3 - "Admin Dashboard Pages"
Cohesion: 0.21
Nodes (14): QuotePageContent(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+6 more)

### Community 4 - "API Worker Dependencies"
Cohesion: 0.10
Nodes (20): author, dependencies, hono, description, devDependencies, @cloudflare/workers-types, typescript, wrangler (+12 more)

### Community 5 - "TypeScript Compiler Setup"
Cohesion: 0.10
Nodes (21): dom, dom.iterable, ./src/*, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+13 more)

### Community 6 - "UI Component Dependencies"
Cohesion: 0.07
Nodes (29): @base-ui/react, class-variance-authority, clsx, firebase, html2canvas-pro, iron-session, lucide-react, next (+21 more)

### Community 7 - "Admin Products & Penawaran Pages"
Cohesion: 0.10
Nodes (6): IconComp, NAV_LINKS, GallerySection(), iconMap, SERVICES, metadata

### Community 8 - "API Worker TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, jsxImportSource, lib, module, moduleResolution, strict, target (+3 more)

### Community 9 - "Next.js Types Reference"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 10 - "App Layout & Metadata"
Cohesion: 0.29
Nodes (5): caveat, cinzel, inter, metadata, playfair

### Community 14 - "Next.js Configuration"
Cohesion: 0.11
Nodes (17): name, private, scripts, build, build:dev, build:prod, db:init-dev, db:init-local (+9 more)

### Community 17 - "ProductCatalog.tsx"
Cohesion: 0.11
Nodes (16): jspdf, jspdf, BaggageModuleComponent(), HOTEL_OPTIONS, FlightLogicModuleComponent(), HOTEL_OPTIONS, HOTEL_OPTIONS, HotelSpecsModuleComponent() (+8 more)

### Community 18 - "middleware.ts"
Cohesion: 0.50
Nodes (4): config, middleware(), Role, ROUTE_RULES

### Community 25 - "Universal Project Bootstrap & Agent Orchestration Guide"
Cohesion: 0.29
Nodes (6): 1. Global Registry Reference, 2. Dynamic Tech Stack & Rule Resolution, 3. Just-In-Time (JIT) Skill & Agent Discovery, 4. Execution Workflow, 5. Custom Workspace Commands, Universal Project Bootstrap & Agent Orchestration Guide

## Knowledge Gaps
- **149 isolated node(s):** `1. Global Registry Reference`, `2. Dynamic Tech Stack & Rule Resolution`, `3. Just-In-Time (JIT) Skill & Agent Discovery`, `4. Execution Workflow`, `5. Custom Workspace Commands` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `UI Component Dependencies` to `ProductCatalog.tsx`, `Next.js Configuration`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `ESLint Configuration` to `Next.js Configuration`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `jspdf` connect `ProductCatalog.tsx` to `UI Component Dependencies`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `1. Global Registry Reference`, `2. Dynamic Tech Stack & Rule Resolution`, `3. Just-In-Time (JIT) Skill & Agent Discovery` to the rest of the system?**
  _149 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Home Page` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Should `ESLint Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Path Aliases Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._