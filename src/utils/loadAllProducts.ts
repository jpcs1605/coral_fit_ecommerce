/**
 * Carrega todos os arquivos products_X.json da pasta public e junta em um único array.
 * @param totalFiles Quantidade de arquivos a buscar (ex: 5 para products_1.json a products_5.json)
 * @returns Promise<Product[]>
 */
import { Product } from '../types';


export async function loadAllProducts(totalFiles: number): Promise<Product[]> {
  const allProducts: Product[] = [];
  for (let i = 1; i <= totalFiles; i++) {
    const url = `/products_${i}.json`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn(`[loadAllProducts] Não foi possível carregar: ${url}`);
        continue;
      }
      const products: Product[] = await resp.json();
      allProducts.push(...products);
      console.log(`[loadAllProducts] Carregado: ${url} (${products.length} itens)`);
    } catch (err) {
      console.error(`[loadAllProducts] Erro ao carregar ${url}:`, err);
    }
  }
  console.log(`[loadAllProducts] Total de produtos carregados: ${allProducts.length}`);
  return allProducts;
}

/**
 * Busca todos os arquivos products_X.json disponíveis automaticamente.
 * Para quando não encontrar mais arquivos válidos.
 */
export async function loadAllProductsAuto(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let i = 1;
  while (true) {
    const url = `/products_${i}.json`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn(`[loadAllProductsAuto] Não foi possível carregar: ${url} (fim da busca)`);
        break;
      }
      const products: Product[] = await resp.json();
      allProducts.push(...products);
      console.log(`[loadAllProductsAuto] Carregado: ${url} (${products.length} itens)`);
    } catch (err) {
      console.error(`[loadAllProductsAuto] Erro ao carregar ${url}:`, err);
      break;
    }
    i++;
  }
  console.log(`[loadAllProductsAuto] Total de produtos carregados: ${allProducts.length}`);
  return allProducts;
}
