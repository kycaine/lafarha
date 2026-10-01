# Graph Report - .  (2026-09-16)

## Corpus Check
- 44 files · ~10,267 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 228 nodes · 328 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 37 edges
2. `compilerOptions` - 16 edges
3. `fetchApi()` - 12 edges
4. `compilerOptions` - 9 edges
5. `Button()` - 8 edges
6. `include` - 7 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `ProductsCMS()` - 6 edges
10. `getProducts()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CalculatePageContent()` --calls--> `getOrderById()`  [EXTRACTED]
  src/app/admin/orders/calculate/page.tsx → src/modules/ordering/actions.ts
- `PenawaranPage()` --calls--> `getProducts()`  [EXTRACTED]
  src/app/penawaran/page.tsx → src/modules/catalog/product-actions.ts
- `QuotePageContent()` --calls--> `getOrderById()`  [EXTRACTED]
  src/app/quote/page.tsx → src/modules/ordering/actions.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "UI Components & Home Page"
Cohesion: 0.09
Nodes (27): Button(), buttonVariants, DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle() (+19 more)

### Community 1 - "ESLint Configuration"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 2 - "Path Aliases Configuration"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 3 - "Admin Dashboard Pages"
Cohesion: 0.20
Nodes (14): AdminDashboard(), CalculatePageContent(), QuotePageContent(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+6 more)

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
Cohesion: 0.38
Nodes (9): AVAILABLE_MODULES, ProductsCMS(), PenawaranPage(), fetchApi(), createProduct(), deleteProduct(), getProducts(), resetProductsToDefault() (+1 more)

### Community 8 - "API Worker TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, jsxImportSource, lib, module, moduleResolution, strict, target (+3 more)

### Community 9 - "Next.js Types Reference"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 10 - "App Layout & Metadata"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **100 isolated node(s):** `name`, `version`, `description`, `main`, `test` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Components & Home Page` to `Admin Dashboard Pages`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `dependencies` connect `UI Component Dependencies` to `ESLint Configuration`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Home Page` be split into smaller, more focused modules?**
  _Cohesion score 0.08773784355179703 - nodes in this community are weakly interconnected._
- **Should `ESLint Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Path Aliases Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `API Worker Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._