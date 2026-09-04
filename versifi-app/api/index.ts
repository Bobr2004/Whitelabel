import { Hono } from 'hono';
import { handle } from '@hono/node-server/vercel';
import { pages } from '../src/pages.gen.js';
import { SITES, withNav } from '../src/nav.js';


const app = new Hono();

// Pages are baked at build time, so render each one once at cold start.
const rendered = new Map<string, string>(
  SITES.map((s) => [s.slug, withNav(pages[s.slug] ?? '', s.slug)]),
);

app.get('/', (c) => c.redirect(`/${SITES[0]!.slug}`, 302));

for (const site of SITES) {
  app.get(`/${site.slug}`, (c) => {
    c.header('Content-Type', 'text/html; charset=utf-8');
    // Immutable per deploy: let the CDN hold it, revalidate in the background.
    c.header('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    return c.body(rendered.get(site.slug)!);
  });
}

app.get('/sites', (c) =>
  c.json(SITES.map(({ slug, label, title }) => ({ slug, label, title, path: `/${slug}` }))),
);

app.notFound((c) => {
  const list = SITES.map((s) => `<li><a href="/${s.slug}">${s.label}</a></li>`).join('');
  return c.html(
    `<!doctype html><meta charset="utf-8"><title>Not found</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;min-height:100vh;display:grid;place-content:center;gap:1rem;
background:#0e0e11;color:#e8ebf0;font:400 15px/1.6 ui-sans-serif,system-ui,sans-serif;text-align:center}
h1{margin:0;font-size:1.3rem;font-weight:600}p{margin:0;color:#8b93a1}
ul{list-style:none;margin:0;padding:0;display:flex;gap:1.2rem;justify-content:center}
a{color:#c9a227}</style>
<h1>No page at ${new URL(c.req.url).pathname}</h1>
<p>Three directions are published here.</p>
<ul>${list}</ul>`,
    404,
  );
});

export { app };
export default handle(app);
