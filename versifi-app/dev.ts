import { serve } from '@hono/node-server';
import { app } from './api/index.js';

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`\n  VersiFi landing pages -> http://localhost:${info.port}\n`);
  console.log('    /certificate   /territory   /hearth\n');
});
