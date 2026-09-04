// Bakes pages/*.html into src/pages.gen.ts so the serverless function needs no
// filesystem access at runtime. Run `npm run gen` after editing any page.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SLUGS = ['certificate', 'territory', 'hearth'];
const SECTIONS = ['', '-intake'];

const keys = SLUGS.flatMap((slug) => SECTIONS.map((s) => `${slug}${s}`));

const entries = keys.map((key) => {
  const html = readFileSync(join(root, 'pages', `${key}.html`), 'utf8');
  return `  ${JSON.stringify(key)}: ${JSON.stringify(html)},`;
});

const out = `// GENERATED FILE — do not edit by hand.
// Source: pages/*.html · Regenerate with: npm run gen
export const pages: Record<string, string> = {
${entries.join('\n')}
};
`;

writeFileSync(join(root, 'src', 'pages.gen.ts'), out);
console.log(`gen: baked ${keys.length} pages -> src/pages.gen.ts`);
console.log(`     ${keys.join(', ')}`);
