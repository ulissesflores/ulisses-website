import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const fallbackHost = 'ulissesflores.com';
const fallbackKey = 'ulissesflores-indexnow-2026-key';

function normalizeHost(hostValue) {
  const cleaned = (hostValue || fallbackHost).replace(/^https?:\/\//i, '').replace(/\/+$/g, '');
  return cleaned || fallbackHost;
}

function loadUrls() {
  const inventoryPath = path.join(repoRoot, 'docs', 'url-inventory.generated.json');
  if (!fs.existsSync(inventoryPath)) {
    return [];
  }

  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  const grouped = inventory.grouped || {};
  const rootUrls = Array.isArray(grouped.root) ? grouped.root : [];
  const collectionUrls = Array.isArray(grouped.collections) ? grouped.collections : [];
  const itemUrls = Array.isArray(grouped.items) ? grouped.items : [];

  const staticCore = [
    'https://ulissesflores.com/identidade',
    'https://ulissesflores.com/simulacoes',
    'https://ulissesflores.com/acervo-teologico',
    'https://ulissesflores.com/certifications',
    'https://ulissesflores.com/mundo-politico',
  ];

  return [...staticCore, ...rootUrls, ...collectionUrls, ...itemUrls];
}

function sanitizeUrls(urls, host) {
  return Array.from(
    new Set(
      urls
        .filter((url) => typeof url === 'string' && url.startsWith('https://'))
        .map((url) => url.split('#')[0])
        .filter((url) => {
          try {
            const parsed = new URL(url);
            return parsed.host === host;
          } catch {
            return false;
          }
        }),
    ),
  );
}

async function pingIndexNow() {
  const enabled = process.env.INDEXNOW_ENABLED === '1';
  if (!enabled) {
    process.stdout.write('IndexNow disabled. Set INDEXNOW_ENABLED=1 to submit.\n');
    return;
  }

  const host = normalizeHost(process.env.INDEXNOW_HOST);
  const key = (process.env.INDEXNOW_KEY || fallbackKey).trim();
  const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
  const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `https://${host}/indexnow-key.txt`;
  const urls = sanitizeUrls(loadUrls(), host);

  if (urls.length === 0) {
    process.stdout.write('IndexNow skipped: no URLs found to submit.\n');
    return;
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList: urls,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`IndexNow error ${response.status}: ${body}`);
  }

  process.stdout.write(`IndexNow submitted ${urls.length} URLs to ${endpoint}\n`);
}

pingIndexNow().catch((error) => {
  process.stderr.write(`IndexNow failed: ${error.message}\n`);
  process.exit(1);
});
