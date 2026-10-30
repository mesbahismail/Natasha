# Natasha — shadcn/ui dashboard template

A free, dark e-commerce admin template built with [shadcn/ui](https://ui.shadcn.com), Next.js (App Router), Tailwind CSS v4, Recharts and [Lucide](https://lucide.dev) icons. It ships as a **shadcn registry**, so you can install the whole template into your own project with one command.

**Pages:** Dashboard · Sales (list + detail) · Products (catalog, detail, new product form) · Insights (earnings, traffic, conversions) · Marketing · Payouts · Inbox · Extensions · Help center · Settings · Go premium

## Install with the shadcn CLI

Requirements:

- A Next.js App Router project with Tailwind CSS v4.
- shadcn/ui initialised in that project (`npx shadcn@latest init`).

```bash
npx shadcn@latest add https://<your-domain>/r/natasha-theme.json https://<your-domain>/r/natasha-dashboard.json
```

Install both items in the same command:

- **`natasha-theme`** (`registry:theme`) replaces your CSS variables with the Natasha tokens.
- **`natasha-dashboard`** (`registry:block`) adds the following, then opens `/dashboard`:
  - the pages under `app/dashboard`
  - the components under `components/natasha`
  - the data helpers under `lib/natasha`
  - the CSS utilities

The block also ships restyled versions of 18 shadcn primitives in `components/ui`:

- alert-dialog, badge, button, card, chart, checkbox
- collapsible, dropdown-menu, input, popover, progress, radio-group
- select, sheet, sonner, table, textarea, tooltip

If you already have any of these, the CLI asks before overwriting them.

To keep a short alias, add the registry to your `components.json`:

```json
{
  "registries": {
    "@natasha": "https://<your-domain>/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @natasha/natasha-theme @natasha/natasha-dashboard
```

## Design system

Everything in the app is built from the tokens in [src/app/globals.css](src/app/globals.css). No one-off values are used.

| Scale    | Values                                                                          |
| -------- | ------------------------------------------------------------------------------- |
| Spacing  | 4px grid with a 2px half-step: 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 |
| Controls | 32 (sm) · 40 (md) · 44 (lg, header actions) · 48 (xl, inputs and navigation)    |
| Radius   | 4 · 6 · 8 · 12 · 16 · 20 · 24 (cards) · 32                                      |
| Surfaces | background → card (panels, sidebar) → secondary (controls, tiles) → popover     |

**Type** — use the `type-*` utilities instead of raw font sizes:

| Utility | Size / line height |
| --- | --- |
| `type-display` | 40/48 |
| `type-headline` | 32/40 |
| `type-title-lg` | 24/32 |
| `type-title` | 18/24 |
| `type-body-lg` | 16/24 |
| `type-body` | 14/20 |
| `type-caption` | 12/16 |
| `type-overline` | 12/16, uppercase |
| `type-micro` | 10/12, uppercase |
| `type-metric-xl` … `type-metric-xs` | 48/56 … 24/32, tabular figures |

**Color** — brand blues (`primary`, `primary-light`, `primary-soft`) and status colors, each with a `soft` fill and a `border` variant:

- `success`
- `warning`
- `danger`
- `destructive`

Charts use the five-step `chart-*` ramp plus the `gradient-from` → `gradient-to` brand gradient.

**Layout:**

- Cards are `rounded-3xl` with 24px padding and 24px gaps.
- The header is 92px tall.
- The sidebar is 336px expanded and 104px collapsed, and the collapsed state is remembered in a cookie.

## Project structure

```
src/app/dashboard/        Routes (each page is a server component)
src/components/natasha/   App shell, page kit, tables, forms, inbox
src/components/natasha/charts/
                          Recharts wrappers + custom SVG charts (bubble, heatmap, funnel, map)
src/components/ui/        Restyled shadcn primitives
src/lib/natasha/          Mock data, analytics series, formatters
scripts/build-registry.mjs
                          Generates registry.json from the source
```

All data comes from `src/lib/natasha/data.ts` and `analytics.ts`, so replace those with your API calls. Dates are formatted in UTC, so server and client render the same markup.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### Rebuilding the registry

`registry.json` is generated from the source, so it never drifts from the app:

- Tokens, utilities and keyframes are read from `globals.css`.
- Files are collected from the folders above.
- npm dependencies are read from the imports, with versions pinned from `package.json`.

```bash
REGISTRY_HOMEPAGE=https://<your-domain> npm run registry:build
```

This writes `registry.json` and `public/r/*.json`. Commit both, then deploy. Each item is served from `/r/<name>.json`.

### Listing it in the shadcn registry directory

1. Deploy the app (for example, on Vercel) and check that `https://<your-domain>/r/registry.json` loads.
2. Set `homepage` in `package.json` to that domain, rebuild the registry, and redeploy.
3. Follow the [Registry Directory](https://ui.shadcn.com/docs/directory) instructions to submit `@natasha` with a pull request to [shadcn-ui/ui](https://github.com/shadcn-ui/ui).

## Credits

- [shadcn/ui](https://ui.shadcn.com) and [Radix UI](https://www.radix-ui.com) — MIT
- [Lucide](https://lucide.dev) icons — ISC
- [Simple Icons](https://simpleicons.org) brand logos — CC0 1.0
- [DiceBear Micah](https://www.dicebear.com/styles/micah/) avatars by Micah Lanier — CC BY 4.0
- [world-atlas](https://github.com/topojson/world-atlas) map data (Natural Earth) — public domain
