export type Site = {
  slug: string;
  label: string;
  /** Accent dot colour, taken from each page's own palette. */
  dot: string;
  title: string;
};

export const SITES: Site[] = [
  { slug: 'certificate', label: 'Certificate', dot: '#a3302a', title: 'Evidence of insurance, revised in time' },
  { slug: 'territory', label: 'Territory', dot: '#c9a227', title: 'Twenty-one states and counting' },
  { slug: 'hearth', label: 'Hearth', dot: '#ff7a66', title: 'Cover for every state your rental is in' },
];

/**
 * The floating switcher. Every property is set explicitly and the selectors are
 * prefixed, because this markup is injected into three pages with very
 * different stylesheets and must not inherit from any of them.
 */
function widget(current: string): string {
  const links = SITES.map((s) => {
    const active = s.slug === current;
    return (
      `<a class="vfsw-i" href="/${s.slug}" style="--vfsw-dot:${s.dot}"` +
      (active ? ' aria-current="page"' : '') +
      `><i class="vfsw-d" aria-hidden="true"></i><span class="vfsw-t">${s.label}</span></a>`
    );
  }).join('');

  return `<style>
.vfsw,.vfsw *{box-sizing:border-box;margin:0;padding:0}
.vfsw{
  position:fixed;right:16px;bottom:16px;z-index:2147483000;
  display:flex;align-items:center;gap:2px;padding:4px;
  border-radius:999px;
  background:rgba(14,14,17,.8);
  -webkit-backdrop-filter:blur(16px) saturate(1.4);backdrop-filter:blur(16px) saturate(1.4);
  border:1px solid rgba(255,255,255,.15);
  box-shadow:0 10px 34px rgba(0,0,0,.34),0 1px 0 rgba(255,255,255,.09) inset;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-size:12.5px;line-height:1;font-weight:500;letter-spacing:.005em;
  -webkit-font-smoothing:antialiased;
}
.vfsw-i{
  display:flex;align-items:center;gap:7px;
  padding:9px 13px;border-radius:999px;
  color:rgba(255,255,255,.66);text-decoration:none;
  border:0;background:transparent;white-space:nowrap;
  transition:color .18s ease,background-color .18s ease;
}
.vfsw-i::before,.vfsw-i::after{content:none!important;display:none!important}
.vfsw-i:hover{color:#fff;background:rgba(255,255,255,.09)}
.vfsw-i:focus-visible{outline:2px solid #fff;outline-offset:2px}
.vfsw-i[aria-current="page"]{color:#111114;background:#fff;font-weight:600}
.vfsw-d{
  width:7px;height:7px;border-radius:50%;flex:none;font-style:normal;
  background:currentColor;opacity:.45;transition:background-color .18s ease,opacity .18s ease;
}
.vfsw-i:hover .vfsw-d{opacity:.75}
.vfsw-i[aria-current="page"] .vfsw-d{background:var(--vfsw-dot);opacity:1}
.vfsw-t{font:inherit;color:inherit}
@media(max-width:420px){
  .vfsw{right:10px;bottom:10px;font-size:11.5px}
  .vfsw-i{padding:8px 10px;gap:6px}
}
@media(prefers-reduced-motion:reduce){
  .vfsw-i,.vfsw-d{transition:none}
}
@media print{.vfsw{display:none}}
</style>
<nav class="vfsw" aria-label="Landing page direction">${links}</nav>`;
}

/** Injects the switcher just before </body>, falling back to appending. */
export function withNav(html: string, current: string): string {
  const w = widget(current);
  const i = html.lastIndexOf('</body>');
  return i === -1 ? html + w : html.slice(0, i) + w + '\n' + html.slice(i);
}
