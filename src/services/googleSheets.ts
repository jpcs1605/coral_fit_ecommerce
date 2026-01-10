import { Product, Color } from "../types";

const SPREADSHEET_ID =
  "14IMBUoWENDMxAmuIEf-yu_ACEkCMjnq_T9OHYnrv3L8";
const SHEET_NAME = "DATABASE_SITE";

// Interface para os dados brutos da planilha
interface SheetRow {
  [key: string]: string;
}

export async function fetchProductsFromSheet(): Promise<
  Product[]
> {
  try {
    // URL para exportar a planilha como CSV
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        "Erro ao buscar dados da planilha. Verifique se a planilha está pública.",
      );
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      throw new Error("Planilha vazia");
    }

    // Primeira linha são os headers
    const headers = rows[0].map((h) => h.toUpperCase().trim());
    const products: Product[] = [];
    const usedIds = new Set<string>();
    let autoIdCounter = 1;

    // Processar cada linha (pulando o header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Criar objeto com os valores da linha
      const rowData: SheetRow = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || "";
      });

      // Buscar valor por múltiplas variações de nome
      const getValue = (...keys: string[]) => {
        for (const key of keys) {
          if (rowData[key.toUpperCase()])
            return rowData[key.toUpperCase()];
        }
        return "";
      };

      const nome = getValue("NOME", "PRODUTO", "NAME");
      const preco = getValue(
        "PREÇO",
        "PRECO",
        "PREÇO (R$)",
        "VALOR",
        "PRICE",
      );

      // Verificar se a linha tem dados válidos
      if (!nome || !preco) {
        continue;
      }

      // Parsear cores (separadas por vírgula ou ponto e vírgula)
      const cores = getValue("CORES", "COR", "COLORS", "COLOR");
      const colors = parseColors(cores);

      // Parsear tamanhos (separados por vírgula ou ponto e vírgula)
      const tamanhos = getValue(
        "TAMANHOS",
        "TAMANHO",
        "SIZES",
        "SIZE",
        "TAM",
      );
      const sizes = parseSizes(tamanhos);

      // Determinar categoria
      const cat = getValue(
        "CATEGORIA",
        "CATEGORY",
        "TIPO",
        "TYPE",
      );
      const category = determineCategory(cat);

      // Obter outros campos
      let id = getValue("ID", "CÓDIGO", "CODIGO", "SKU");

      // Se não tiver ID ou se o ID já foi usado, criar um único
      if (!id || usedIds.has(id)) {
        do {
          id = `product-${autoIdCounter}`;
          autoIdCounter++;
        } while (usedIds.has(id));
      }

      usedIds.add(id);

      const descricao = getValue(
        "DESCRIÇÃO",
        "DESCRICAO",
        "DESCRIÇAO",
        "DESC",
        "DESCRIPTION",
      );
      const imagem = getValue(
        "IMAGEM",
        "IMG",
        "IMAGE",
        "URL",
        "FOTO",
        "URL_IMAGEM",
      );

      // Criar produto
      const product: Product = {
        id: id,
        name: nome,
        price: parsePrice(preco),
        image: normalizeImageUrl(imagem) || getDefaultImage(category),
        category: category,
        colors: colors.length > 0 ? colors : getDefaultColors(),
        sizes: sizes.length > 0 ? sizes : ["P", "M", "G"],
        description: descricao || nome,
      };

      products.push(product);
    }

    return products;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    // Retornar array vazio em caso de erro
    return [];
  }
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  const lines = csv.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    const row: string[] = [];
    let cell = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        row.push(cell.trim());
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell.trim());
    rows.push(row);
  }

  return rows;
}

function parseColors(colorsString: string): Color[] {
  if (!colorsString) return [];

  const colorMap: { [key: string]: string } = {
    preto: "#000000",
    preta: "#000000",
    branco: "#FFFFFF",

    // Cores já existentes
    turquesa: "#00B4D8",
    "azul turquesa": "#48CAE4",
    azul: "#0096C7",
    "azul royal": "#0096C7",
    "azul marinho": "#1E3A8A",
    "azul petróleo": "#0E7490",
    coral: "#FF7F51",
    rosa: "#FF6B9D",
    vermelho: "#DC2626",
    verde: "#06D6A0",
    "verde menta": "#5EEAD4",
    "verde limão": "#84CC16",
    amarelo: "#FFD60A",
    roxo: "#9333EA",
    cinza: "#6B7280",
    "cinza escuro": "#374151",
    vinho: "#881337",
    bege: "#D4A574",
    laranja: "#FB923C",
    nude: "#E8C5B5",
    pink: "#EC4899",
    lilás: "#C084FC",

    // Novas cores solicitadas
    "verde água": "#7FFFD4",
    marrom: "#8B4513",
    "azul bebê": "#89CFF0",
    "terra cota": "#E2725B",
    "bege escuro": "#D2B48C",
    "preto com rosa": "#FF69B4", // Rosa usado como detalhe
  };

  const colors: Color[] = [];
  const colorNames = colorsString
    .split(/[,;]/)
    .map((c) => c.trim().toLowerCase());

  for (const colorName of colorNames) {
    if (colorName) {
      const hex = colorMap[colorName] || "#808080";
      colors.push({
        name: capitalize(colorName),
        hex: hex,
      });
    }
  }

  return colors;
}

function parseSizes(sizesString: string): string[] {
  if (!sizesString) return [];

  return sizesString
    .split(/[,;]/)
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s.length > 0);
}

function parsePrice(priceString: string): number {
  // Remove R$, espaços, e substitui vírgula por ponto
  const cleanPrice = priceString
    .replace(/R\$\s*/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const price = parseFloat(cleanPrice);
  return isNaN(price) ? 0 : price;
}

function determineCategory(categoryString: string): string {
  if (!categoryString) return "Geral";
  return capitalize(categoryString.trim());
}

function getDefaultColors(): Color[] {
  return [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Turquesa", hex: "#00B4D8" },
  ];
}

function getDefaultImage(category: string): string {
  // Imagens padrão caso não tenha URL na planilha
  if (category.toLowerCase().includes("praia")) {
    return "https://images.unsplash.com/photo-1722409268640-c51c1bc190ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN3aW13ZWFyJTIwYmVhY2h8ZW58MXx8fHwxNzYzODMzNDI5fDA&ixlib=rb-4.1.0&q=80&w=1080";
  }
  return "https://images.unsplash.com/photo-1679384323784-425465246301?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZpdG5lc3MlMjB3ZWFyfGVufDF8fHx8MTc2MzgzMzQyOHww&ixlib=rb-4.1.0&q=80&w=1080";
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeImageUrl(url: string): string {
  if (!url) return "";

  // Se já for uma URL do Google Drive direta, mantém
  if (url.includes("lh3.googleusercontent.com")) return url;

  // Extrair ID do Google Drive
  let id = "";

  // Padrão 1: drive.google.com/uc?export=view&id=XXX
  const matchId = url.match(/[?&]id=([^&]+)/);
  if (matchId) {
    id = matchId[1];
  }
  // Padrão 2: drive.google.com/file/d/XXX/view
  else {
    const matchFileId = url.match(/\/d\/([^/]+)/);
    if (matchFileId) {
      id = matchFileId[1];
    }
  }

  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}`;
  }

  return url;
}