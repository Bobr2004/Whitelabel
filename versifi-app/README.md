# VersiFi Insurance — landing pages

A Hono app that serves three landing page directions for VersiFi Insurance, with a
floating switcher in the bottom-right corner for moving between them.

| Route | Direction | Character |
|---|---|---|
| `/certificate` | **Certificate** | Paper sheets on a desk; the hero is a live Evidence of Insurance that types its own revision and gets stamped |
| `/territory` | **Territory** | Pine and brass; a tile-grid US map lighting the 21 licensed states |
| `/hearth` | **Hearth** | Warm and rounded; tabs swap a CSS house between occupied, empty, renovating and nightly |

`/` redirects to `/certificate`. `/sites` returns the list as JSON.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `dev` regenerates the baked pages and watches for changes.

## Deploy to Vercel

```bash
vercel
```

Zero configuration beyond `vercel.json`, which rewrites every path to the single
serverless function in `api/index.ts`. Nothing else needs setting up — no build
step runs on Vercel, no environment variables, no static output directory.

## How the pages are served

The three pages are ordinary standalone HTML files in `pages/`. `npm run gen` bakes
them into `src/pages.gen.ts` as string constants, which is what the function imports.

That indirection exists so the serverless function never touches the filesystem:
`fs` reads inside a Vercel function depend on `includeFiles` config and on which
directory the bundler decides is the working directory, and both are easy to get
wrong in a way that only shows up after deploy. Importing a module cannot fail that way.

**`src/pages.gen.ts` is generated and committed.** After editing anything in `pages/`,
run:

```bash
npm run gen
```

The switcher itself is injected into each page at cold start by `withNav()` in
`src/nav.ts`, immediately before `</body>` — the HTML files in `pages/` stay clean and
still work when opened directly in a browser.

## Layout

```
api/index.ts       Hono app + Vercel handler (the only function)
dev.ts             local server, reuses the same app
pages/*.html       the three pages, editable and standalone
src/nav.ts         the floating switcher + injector
src/pages.gen.ts   generated from pages/ — do not edit
scripts/gen.mjs    the generator
```

## Notes on the switcher

It is a fixed-position `<nav>` with a very high z-index, its own prefixed class names
(`.vfsw*`), and every property set explicitly — it is injected into three pages with
very different stylesheets and must not inherit from any of them. It marks the current
page with `aria-current="page"`, is keyboard reachable with a visible focus ring,
respects `prefers-reduced-motion`, and is hidden in print.
