import { Product, Color, StockItem } from '../types';

// URLs servidas localmente: em dev o Vite faz proxy transparente para o Sheets;
// em produção os arquivos são gerados pelo script prebuild (scripts/fetchSheetsData.mjs).
const SHEET_CSV_URL  = '/sheets-data/products.csv';
const BANNER_CSV_URL = '/sheets-data/banners.csv';
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/jpcs1605/coral_fit_ecommerce/main/public/products.json';

// ---------------------------------------------------------------------------
// Estrutura esperada da aba BANNER:
//
// | Imagem | Título (opcional) | Link (opcional) |
//
// Cada linha é um slide do carrossel.
// URLs de imagem podem ser do Google Drive (qualquer formato compartilhado).
// ---------------------------------------------------------------------------

export interface BannerSlide {
  image: string;
  title?: string;
  link?: string;
}

export async function fetchBannerSlides(): Promise<BannerSlide[]> {
  try {
    const res = await fetch(BANNER_CSV_URL);
    if (!res.ok) return [];
    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const imgCol   = headers.findIndex(h => h.includes('imagem') || h.includes('image') || h.includes('foto') || h.includes('url'));
    const titleCol = headers.findIndex(h => h.includes('título') || h.includes('titulo') || h.includes('title'));
    const linkCol  = headers.findIndex(h => h.includes('link') || h.includes('url_destino'));

    if (imgCol === -1) return [];

    const slides: BannerSlide[] = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const rawImg = r[imgCol]?.trim();
      if (!rawImg) continue;
      slides.push({
        image: toDriveDirectUrl(rawImg),
        title: titleCol >= 0 ? r[titleCol]?.trim() || undefined : undefined,
        link:  linkCol  >= 0 ? r[linkCol]?.trim()  || undefined : undefined,
      });
    }
    return slides;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Estrutura esperada da planilha (uma linha por variação):
//
// | Código | Nome | Categoria | Preço | Preço Pago | Descrição |
// | Cor | Tamanho | Quantidade | Imagem 1 | Imagem 2 | Imagem 3 |
//
// Linhas com o mesmo Código são agrupadas em um produto.
// Nome/Categoria/Preço/Descrição podem ficar só na primeira linha do grupo.
// URLs de imagem podem ser do Google Drive (qualquer formato de link compartilhado).
// ---------------------------------------------------------------------------

// Mapeamento nome de cor (PT) → hexadecimal
const COLOR_HEX: Record<string, string> = {
  'vermelho':       '#E8342A',
  'fuscia':         '#E91E8C',
  'fúcsia':         '#E91E8C',
  'fucsia':         '#E91E8C',
  'rosa':           '#FF69B4',
  'rosa bebê':      '#FFB6C1',
  'azul':           '#1565C0',
  'azul royal':     '#4169E1',
  'azul marinho':   '#1A237E',
  'verde':          '#2E7D32',
  'verde militar':  '#4E5D27',
  'preto':          '#1A1A1A',
  'branco':         '#FFFFFF',
  'amarelo':        '#FDD835',
  'laranja':        '#F57C00',
  'roxo':           '#6A1B9A',
  'dourado':        '#D4AF37',
  'bege':           '#F5E6D3',
  'nude':           '#E8C9A0',
  'marrom':         '#6D4C41',
  'cinza':          '#757575',
  'navy':           '#1A237E',
  'coral':          '#FF6B6B',
  'lilas':          '#C5B1E8',
  'lilás':          '#C5B1E8',
  'turquesa':       '#00BCD4',
  'caramelo':       '#C68642',
  'vinho':          '#722F37',
  'terracota':      '#C17A5A',
};

function getHex(colorName: string): string {
  return COLOR_HEX[colorName.toLowerCase().trim()] ?? '#CCCCCC';
}

// ---------------------------------------------------------------------------
// Converte qualquer link de compartilhamento do Google Drive para URL de
// visualização direta, compatível com <img src="...">.
//
// Formatos suportados:
//   https://drive.google.com/file/d/{ID}/view?...
//   https://drive.google.com/open?id={ID}
//   https://drive.google.com/uc?id={ID}&...
// ---------------------------------------------------------------------------
function toDriveDirectUrl(url: string): string {
  if (!url) return url;

  // Já está no formato direto
  if (url.includes('lh3.googleusercontent.com')) return url;

  // Extrai o file ID de qualquer formato Google Drive
  const byPath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (byPath) return `https://lh3.googleusercontent.com/d/${byPath[1]}`;

  const byParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (byParam) return `https://lh3.googleusercontent.com/d/${byParam[1]}`;

  return url; // URL não-Drive: retorna sem alterar
}

// ---------------------------------------------------------------------------
// Parser CSV mínimo — suporta campos entre aspas, vírgulas internas e
// aspas duplas escapadas ("").
// ---------------------------------------------------------------------------
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQ = false;

  for (let i = 0; i <= text.length; i++) {
    const ch = i < text.length ? text[i] : '\n';

    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cell += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      row.push(cell); cell = '';
    } else if ((ch === '\n' || ch === '\r') && !inQ) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(c => c !== '')) rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }

  return rows;
}

function findCol(headers: string[], ...terms: string[]): number {
  return headers.findIndex(h => terms.some(t => h.toLowerCase().includes(t)));
}

// Encontra todos os índices de colunas de imagem (Imagem 1, Imagem 2, Foto 1…)
function findImageCols(headers: string[]): number[] {
  return headers
    .map((h, i) => ({ h: h.toLowerCase().trim(), i }))
    .filter(({ h }) => h.startsWith('imagem') || h.startsWith('foto') || h.startsWith('image'))
    .map(({ i }) => i);
}

// ---------------------------------------------------------------------------
// Linha crua extraída do CSV
// ---------------------------------------------------------------------------
interface RawRow {
  code:        string;
  name:        string;
  category:    string;
  price:       string;
  pricePaid:   string;
  description: string;
  color:       string;
  size:        string;
  quantity:    string;
  images:      string[]; // já convertidas para URL direta
}

async function fetchSheetRows(): Promise<Product[]> {
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`Google Sheets: ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().trim());

  const cols = {
    code:        findCol(headers, 'código', 'codigo', 'code'),
    name:        findCol(headers, 'nome', 'name'),
    category:    findCol(headers, 'categoria', 'category'),
    price:       findCol(headers, 'preço', 'preco', 'price'),
    pricePaid:   findCol(headers, 'pago', 'paid'),
    description: findCol(headers, 'descritivo', 'descrição', 'descricao', 'description'),
    color:       findCol(headers, 'cor', 'color', 'colour'),
    size:        findCol(headers, 'tamanho', 'size', 'tam'),
    quantity:    findCol(headers, 'quantidade', 'quantity', 'qtd', 'qty', 'estoque'),
    imageCols:   findImageCols(headers),
  };

  // Parse cada linha como RawRow
  const rawRows: RawRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const code = r[cols.code]?.trim();
    if (!code) continue;

    const images = cols.imageCols
      .map(ci => r[ci]?.trim() ?? '')
      .filter(Boolean)
      .map(toDriveDirectUrl);

    rawRows.push({
      code,
      name:        r[cols.name]?.trim()        ?? '',
      category:    r[cols.category]?.trim()    ?? '',
      price:       r[cols.price]?.trim()       ?? '',
      pricePaid:   cols.pricePaid >= 0 ? (r[cols.pricePaid]?.trim() ?? '') : '',
      description: cols.description >= 0 ? (r[cols.description]?.trim() ?? '') : '',
      color:       cols.color >= 0 ? (r[cols.color]?.trim() ?? '') : '',
      size:        cols.size >= 0 ? (r[cols.size]?.trim() ?? '') : '',
      quantity:    cols.quantity >= 0 ? (r[cols.quantity]?.trim() ?? '0') : '0',
      images,
    });
  }

  // Agrupa linhas pelo Código
  const grouped = new Map<string, RawRow[]>();
  for (const row of rawRows) {
    if (!grouped.has(row.code)) grouped.set(row.code, []);
    grouped.get(row.code)!.push(row);
  }

  const products: Product[] = [];

  for (const [code, group] of grouped) {
    // Campos de nível produto: usa primeiro valor não-vazio do grupo
    const name        = group.find(r => r.name)?.name        ?? '';
    const category    = group.find(r => r.category)?.category ?? 'Praia';
    const price       = parseFloat((group.find(r => r.price)?.price ?? '').replace(',', '.'))     || 0;
    const pricePaidRaw = parseFloat((group.find(r => r.pricePaid)?.pricePaid ?? '').replace(',', '.'));
    const pricePaid   = isNaN(pricePaidRaw) ? undefined : pricePaidRaw || undefined;
    const description = group.find(r => r.description)?.description ?? '';

    // Imagens: coleta todas as linhas do grupo, sem duplicatas
    const allImages = [...new Set(group.flatMap(r => r.images).filter(Boolean))];

    // Cores únicas (preservando ordem de aparição)
    const colorNames = [...new Set(group.filter(r => r.color).map(r => r.color))];
    // Tamanhos únicos (preservando ordem de aparição)
    const sizeNames  = [...new Set(group.filter(r => r.size).map(r => r.size))];

    const colors: Color[] = colorNames.map(n => ({ name: n, hex: getHex(n) }));

    const stock: StockItem[] = group
      .filter(r => r.color && r.size)
      .map(r => ({
        color:    r.color,
        size:     r.size,
        quantity: parseInt(r.quantity, 10) || 0,
      }));

    products.push({
      id:          code,
      code,
      name,
      category,
      price,
      pricePaid,
      description,
      image:       allImages[0] ?? '',
      images:      allImages,
      colors,
      sizes:       sizeNames,
      stock,
      tags:        [category.toLowerCase()],
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    });
  }

  return products;
}

// ---------------------------------------------------------------------------
// Busca imagens/descrição do JSON no GitHub como fallback (enquanto a
// planilha não tiver colunas de imagem preenchidas).
// ---------------------------------------------------------------------------
async function fetchJSONFallback(): Promise<Map<string, Pick<Product, 'image' | 'images' | 'description'>>> {
  try {
    const res = await fetch(GITHUB_JSON_URL);
    if (!res.ok) return new Map();
    const data: Product[] = await res.json();
    return new Map(data.map(p => {
      // Achata todas as imagens: product.images + todas as variantImages
      const seen = new Set<string>();
      const allImages: string[] = [];
      const add = (url: string) => { if (url && !seen.has(url)) { seen.add(url); allImages.push(url); } };

      (p.images ?? []).forEach(add);
      if (p.image) add(p.image);
      (p.variantImages ?? []).forEach(vi => vi.images.forEach(add));

      return [p.code, { image: allImages[0] ?? '', images: allImages, description: p.description }];
    }));
  } catch {
    return new Map();
  }
}

/**
 * Ponto de entrada principal.
 * Busca da planilha (fonte de verdade) e mescla com JSON do GitHub para
 * imagens/descrição enquanto a planilha não tiver essas colunas preenchidas.
 */
export async function fetchProductsFromSheets(): Promise<Product[]> {
  const [sheetProducts, jsonMap] = await Promise.all([
    fetchSheetRows().catch((): Product[] => []),
    fetchJSONFallback(),
  ]);

  return sheetProducts.map(p => {
    const json = jsonMap.get(p.code);
    return {
      ...p,
      image:       p.image         || json?.image       || '',
      images:      p.images.length ? p.images           : (json?.images ?? []),
      description: p.description  || json?.description || '',
    };
  });
}
