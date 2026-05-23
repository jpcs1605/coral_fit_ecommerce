/**
 * Script de pré-build: busca os dados da planilha Google Sheets e salva como
 * arquivos estáticos em public/sheets-data/.
 *
 * Executado pelo npm antes do build ("prebuild") para que o browser nunca
 * precise fazer requisição diretamente ao Google Sheets.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'sheets-data');

const SHEET_ID = process.env.SHEETS_ID ?? '1qC-tgJRlZM01NSMSEIaB2Np7Ut-NgMzrztgh0FluU20';
const PRODUCTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
const BANNERS_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=BANNER`;

async function fetchCSV(url, label) {
  console.log(`[sheets] Baixando ${label}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${label}`);
  return res.text();
}

async function main() {
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const [products, banners] = await Promise.allSettled([
    fetchCSV(PRODUCTS_URL, 'produtos'),
    fetchCSV(BANNERS_URL, 'banners'),
  ]);

  if (products.status === 'fulfilled') {
    writeFileSync(join(outputDir, 'products.csv'), products.value, 'utf8');
    console.log('[sheets] ✓ public/sheets-data/products.csv salvo');
  } else {
    console.error('[sheets] ✗ Falha ao buscar produtos:', products.reason.message);
    process.exitCode = 1;
  }

  if (banners.status === 'fulfilled') {
    writeFileSync(join(outputDir, 'banners.csv'), banners.value, 'utf8');
    console.log('[sheets] ✓ public/sheets-data/banners.csv salvo');
  } else {
    console.error('[sheets] ✗ Falha ao buscar banners:', banners.reason.message);
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('[sheets] Erro fatal:', err);
  process.exit(1);
});
