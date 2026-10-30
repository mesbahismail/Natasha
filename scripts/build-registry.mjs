/**
 * Generates `registry.json` (the shadcn registry manifest) from the source so
 * it never drifts from the app:
 *
 *   - CSS variables, theme tokens, utilities and keyframes come from
 *     src/app/globals.css
 *   - files are collected from src/app/dashboard, src/components/natasha,
 *     src/lib/natasha and the restyled src/components/ui primitives
 *   - npm dependencies are read from the imports in those files, with the
 *     version ranges pinned in package.json
 *
 * Run `npm run registry:build` — it calls this, then `shadcn build`, which
 * inlines the file contents into public/r/*.json.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import postcss from "postcss"

const root = fileURLToPath(new URL("..", import.meta.url))
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const homepage = process.env.REGISTRY_HOMEPAGE ?? pkg.homepage

/* CSS ---------------------------------------------------------------------- */

const css = postcss.parse(readFileSync(join(root, "src/app/globals.css"), "utf8"))
const themeVars = {}
const tokens = {}
const cssRules = {}

/** postcss node → shadcn `css` object (nested rules, `@apply …` keys). */
function toObject(node) {
  const out = {}
  node.each((child) => {
    if (child.type === "decl") out[child.prop] = child.value
    else if (child.type === "atrule" && child.name === "apply") out[`@apply ${child.params}`] = {}
    else if (child.type === "rule") out[child.selector.replace(/\s*,\s*/g, ", ")] = toObject(child)
    else if (child.type === "atrule") out[`@${child.name} ${child.params}`] = toObject(child)
  })
  return out
}

css.each((node) => {
  if (node.type === "atrule" && node.name === "theme" && node.params === "inline") {
    node.each((child) => {
      if (child.type === "decl") themeVars[child.prop.replace(/^--/, "")] = child.value
      // Keyframes nested in @theme are emitted at the top level instead.
      else if (child.type === "atrule" && child.name === "keyframes") cssRules[`@keyframes ${child.params}`] = toObject(child)
    })
  } else if (node.type === "rule" && node.selector.includes(":root")) {
    node.each((child) => {
      if (child.type !== "decl") return
      if (child.prop.startsWith("--")) tokens[child.prop.replace(/^--/, "")] = child.value
      else (cssRules["@layer base"] ??= {})[":root"] = { ...cssRules["@layer base"]?.[":root"], [child.prop]: child.value }
    })
  } else if (node.type === "atrule" && (node.name === "utility" || node.name === "keyframes")) {
    cssRules[`@${node.name} ${node.params}`] = toObject(node)
  } else if (node.type === "atrule" && node.name === "layer") {
    cssRules[`@layer ${node.params}`] = { ...cssRules[`@layer ${node.params}`], ...toObject(node) }
  }
})

// The kit relies on tw-animate-css (enter/exit animations) and shadcn's
// tailwind.css (no-scrollbar, scroll-fade-*, data-open/data-checked variants).
const cssImports = { '@import "tw-animate-css"': {}, '@import "shadcn/tailwind.css"': {} }
const cssPackages = ["shadcn", "tw-animate-css"]

// Dark-first theme: light and dark carry the same tokens.
const cssVars = { theme: themeVars, light: tokens, dark: tokens }

/* Files -------------------------------------------------------------------- */

function walk(dir) {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name)
    return statSync(join(root, path)).isDirectory() ? walk(path) : [path]
  })
}

const isSource = (path) => /\.(tsx?|jsx?)$/.test(path)

const files = [
  ...walk("src/app/dashboard")
    .filter(isSource)
    .map((path) => ({ path, type: "registry:page", target: path.replace(/^src\//, "") })),
  ...walk("src/components/natasha")
    .filter(isSource)
    .map((path) => ({ path, type: "registry:component" })),
  ...walk("src/lib/natasha")
    .filter(isSource)
    .map((path) => ({ path, type: "registry:lib" })),
  ...walk("src/components/ui")
    .filter(isSource)
    .map((path) => ({ path, type: "registry:ui" })),
].sort((a, b) => a.path.localeCompare(b.path))

/* Dependencies ------------------------------------------------------------- */

const provided = new Set(["react", "react-dom", "next"])
const used = new Set()
for (const file of files) {
  // Type-only imports need no runtime package.
  const source = readFileSync(join(root, file.path), "utf8").replace(/import\s+type\s[^;]+?from\s+["'][^"']+["']/g, "")
  for (const [, spec] of source.matchAll(/from\s+["']([^"'.@][^"']*|@[^/"']+\/[^"']+)["']/g)) {
    if (spec.startsWith("@/")) continue
    const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]
    if (!provided.has(name)) used.add(name)
  }
}

const versioned = (name, table) => (table?.[name] ? `${name}@${table[name]}` : name)
const dependencies = [...used, ...cssPackages]
  .filter((n) => pkg.dependencies?.[n])
  .sort()
  .map((n) => versioned(n, pkg.dependencies))
const missing = [...used].filter((n) => !pkg.dependencies?.[n])
if (missing.length) throw new Error(`Imported but not in package.json dependencies: ${missing.join(", ")}`)

const typePackages = { "d3-geo": "@types/d3-geo", "topojson-client": "@types/topojson-client" }
const devDependencies = [
  ...Object.entries(typePackages)
    .filter(([n]) => used.has(n))
    .map(([, t]) => versioned(t, pkg.devDependencies)),
  versioned("@types/topojson-specification", pkg.devDependencies),
]

/* Manifest ----------------------------------------------------------------- */

const author = "Ismail Mesbah"

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "natasha",
  homepage,
  items: [
    {
      name: "natasha-theme",
      type: "registry:theme",
      title: "Natasha Theme",
      author,
      description:
        "Dark-first design tokens for the Natasha dashboard: surfaces, brand blues, status colors, chart ramp and an 8-step radius scale.",
      cssVars,
      css: { "@layer base": { ":root": cssRules["@layer base"]?.[":root"] ?? {} } },
    },
    {
      name: "natasha-dashboard",
      type: "registry:block",
      title: "Natasha Dashboard",
      author,
      description:
        "A complete dark e-commerce admin template — dashboard, sales, products, insights, marketing, payouts, inbox, extensions and help center — built on a strict 4px spacing grid.",
      categories: ["dashboard", "admin", "e-commerce", "charts", "template"],
      dependencies,
      devDependencies,
      cssVars,
      css: { ...cssImports, ...cssRules },
      files,
      docs: "Open /dashboard to see the template. Install natasha-theme alongside this block so its tokens replace the default shadcn colors.",
    },
  ],
}

writeFileSync(join(root, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`)
console.log(
  `registry.json: ${registry.items.length} items, ${files.length} files, ${dependencies.length} dependencies → ${relative(root, join(root, "public/r"))}`
)
