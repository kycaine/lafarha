# Graph Report - LA  (2026-10-01)

## Corpus Check
- 80 files · ~277,977 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 288 nodes · 348 edges · 27 communities (19 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75d19f8c`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 37 edges
2. `compilerOptions` - 16 edges
3. `fetchApi()` - 12 edges
4. `compilerOptions` - 9 edges
5. `include` - 7 edges
6. `Universal Project Bootstrap & Agent Orchestration Guide` - 6 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `scripts` - 5 edges
10. `Button()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Card()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (27 total, 8 thin omitted)

### Community 0 - "UI Components & Home Page"
Cohesion: 0.10
Nodes (25): Button(), buttonVariants, CardAction(), CardFooter(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+17 more)

### Community 1 - "ESLint Configuration"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 2 - "Path Aliases Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 3 - "Admin Dashboard Pages"
Cohesion: 0.18
Nodes (18): AdminDashboard(), QuotePageContent(), Card(), CardContent(), CardDescription(), CardHeader(), CardTitle(), fetchApi() (+10 more)

### Community 4 - "API Worker Dependencies"
Cohesion: 0.10
Nodes (20): author, dependencies, hono, description, devDependencies, @cloudflare/workers-types, typescript, wrangler (+12 more)

### Community 5 - "TypeScript Compiler Setup"
Cohesion: 0.10
Nodes (21): dom, dom.iterable, ./src/*, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+13 more)

### Community 6 - "UI Component Dependencies"
Cohesion: 0.11
Nodes (19): @base-ui/react, class-variance-authority, clsx, lucide-react, next, dependencies, @base-ui/react, class-variance-authority (+11 more)

### Community 7 - "Admin Products & Penawaran Pages"
Cohesion: 0.10
Nodes (9): ContactSettings, DEFAULT, FooterSection(), IconMail(), IconPin(), IconWhatsApp(), LINKS, PRODUCTS (+1 more)

### Community 8 - "API Worker TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, jsxImportSource, lib, module, moduleResolution, strict, target (+3 more)

### Community 9 - "Next.js Types Reference"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 10 - "App Layout & Metadata"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 17 - "ProductCatalog.tsx"
Cohesion: 0.40
Nodes (3): ICON_MAP, ModuleSpecs, ProductCatalog()

### Community 18 - "middleware.ts"
Cohesion: 0.50
Nodes (4): config, middleware(), Role, ROUTE_RULES

### Community 25 - "Universal Project Bootstrap & Agent Orchestration Guide"
Cohesion: 0.29
Nodes (6): 1. Global Registry Reference, 2. Dynamic Tech Stack & Rule Resolution, 3. Just-In-Time (JIT) Skill & Agent Discovery, 4. Execution Workflow, 5. Custom Workspace Commands, Universal Project Bootstrap & Agent Orchestration Guide

## Knowledge Gaps
- **116 isolated node(s):** `1. Global Registry Reference`, `2. Dynamic Tech Stack & Rule Resolution`, `3. Just-In-Time (JIT) Skill & Agent Discovery`, `4. Execution Workflow`, `5. Custom Workspace Commands` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Components & Home Page` to `Admin Dashboard Pages`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `dependencies` connect `UI Component Dependencies` to `ESLint Configuration`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `1. Global Registry Reference`, `2. Dynamic Tech Stack & Rule Resolution`, `3. Just-In-Time (JIT) Skill & Agent Discovery` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Home Page` be split into smaller, more focused modules?**
  _Cohesion score 0.1006006006006006 - nodes in this community are weakly interconnected._
- **Should `ESLint Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Path Aliases Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `API Worker Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._