import { Product, Color, StockItem } from '../types';

const STORAGE_KEY = 'coral_fit_products';
const PRODUCTS_JSON_URL = '/coral_fit_ecommerce/products.json';

// Função auxiliar para gerar ID único
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Carregar produtos do arquivo JSON (fonte de verdade)
export async function loadProductsFromJSON(): Promise<Product[]> {
  try {
    console.log('[ProductService] Carregando do products.json...');
    const response = await fetch(PRODUCTS_JSON_URL);
    if (!response.ok) {
      console.warn('[ProductService] products.json não encontrado, usando localStorage');
      return [];
    }
    const products = await response.json();
    console.log('[ProductService] ✓ Carregado do JSON:', products.length, 'produtos');
    
    // Sincronizar com localStorage
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
    
    return products;
  } catch (error) {
    console.error('[ProductService] Erro ao carregar do JSON:', error);
    return [];
  }
}

// Carregar produtos (localStorage como cache)
export function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('[ProductService] Carregando produtos:', stored ? 'Dados encontrados' : 'Nenhum dado');
    if (!stored) return [];
    const products = JSON.parse(stored);
    console.log('[ProductService] Produtos carregados:', products.length);
    return products;
  } catch (error) {
    console.error('[ProductService] Erro ao carregar produtos:', error);
    return [];
  }
}

// Inicializar produtos (carrega do JSON se localStorage estiver vazio)
export async function initializeProducts(): Promise<Product[]> {
  const localProducts = loadProducts();
  
  if (localProducts.length === 0) {
    console.log('[ProductService] localStorage vazio, carregando do JSON...');
    const jsonProducts = await loadProductsFromJSON();
    return jsonProducts;
  }
  
  return localProducts;
}

// Salvar produtos no localStorage
export function saveProducts(products: Product[]): void {
  try {
    const jsonData = JSON.stringify(products);
    console.log('[ProductService] Salvando produtos:', products.length, 'produtos');
    console.log('[ProductService] Tamanho dos dados:', (jsonData.length / 1024).toFixed(2), 'KB');
    localStorage.setItem(STORAGE_KEY, jsonData);
    console.log('[ProductService] ✓ Produtos salvos com sucesso!');
    
    // Disparar evento customizado para notificar outras partes da aplicação
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    console.log('[ProductService] Evento productsUpdated disparado');
  } catch (error) {
    console.error('[ProductService] ✗ Erro ao salvar produtos:', error);
    throw new Error('Erro ao salvar produtos: ' + (error as Error).message);
  }
}

// Buscar produto por ID
export function getProductById(id: string): Product | undefined {
  const products = loadProducts();
  return products.find(p => p.id === id);
}

// Buscar produto por código
export function getProductByCode(code: string): Product | undefined {
  const products = loadProducts();
  return products.find(p => p.code === code);
}

// Criar novo produto
export function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  console.log('[ProductService] Criando novo produto:', productData.code, productData.name);
  const products = loadProducts();
  
  // Verificar se o código já existe
  if (getProductByCode(productData.code)) {
    throw new Error('Já existe um produto com este código');
  }

  const newProduct: Product = {
    ...productData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  console.log('[ProductService] Total de produtos após adicionar:', products.length);
  saveProducts(products);
  console.log('[ProductService] ✓ Produto criado com sucesso!');
  return newProduct;
}

// Atualizar produto
export function updateProduct(id: string, productData: Partial<Product>): Product {
  const products = loadProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Produto não encontrado');
  }

  // Se o código foi alterado, verificar se já existe
  if (productData.code && productData.code !== products[index].code) {
    if (getProductByCode(productData.code)) {
      throw new Error('Já existe um produto com este código');
    }
  }

  const updatedProduct: Product = {
    ...products[index],
    ...productData,
    id: products[index].id, // Manter ID original
    createdAt: products[index].createdAt, // Manter data de criação
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
}

// Deletar produto
export function deleteProduct(id: string): void {
  const products = loadProducts();
  const filtered = products.filter(p => p.id !== id);
  
  if (filtered.length === products.length) {
    throw new Error('Produto não encontrado');
  }

  saveProducts(filtered);
}

// Atualizar estoque de um item específico
export function updateStock(
  productId: string,
  color: string,
  size: string,
  quantity: number
): Product {
  const products = loadProducts();
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) {
    throw new Error('Produto não encontrado');
  }

  const product = products[index];
  const stockIndex = product.stock.findIndex(
    s => s.color === color && s.size === size
  );

  if (stockIndex === -1) {
    // Adicionar novo item de estoque
    product.stock.push({ color, size, quantity });
  } else {
    // Atualizar item existente
    product.stock[stockIndex].quantity = quantity;
  }

  product.updatedAt = new Date().toISOString();
  products[index] = product;
  saveProducts(products);
  return product;
}

// Obter estoque disponível para uma combinação de cor e tamanho
export function getAvailableStock(productId: string, color: string, size: string): number {
  const product = getProductById(productId);
  if (!product) return 0;

  const stockItem = product.stock.find(s => s.color === color && s.size === size);
  return stockItem?.quantity || 0;
}

// Reduzir estoque (para quando um pedido for feito)
export function reduceStock(
  productId: string,
  color: string,
  size: string,
  quantity: number
): Product {
  const currentStock = getAvailableStock(productId, color, size);
  
  if (currentStock < quantity) {
    throw new Error('Estoque insuficiente');
  }

  return updateStock(productId, color, size, currentStock - quantity);
}

// Exportar produtos para JSON
export function exportToJSON(): string {
  const products = loadProducts();
  return JSON.stringify(products, null, 2);
}

// Baixar arquivo JSON atualizado (para substituir no projeto)
export function downloadProductsJSON(): void {
  const products = loadProducts();
  const json = JSON.stringify(products, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('[ProductService] ✓ products.json baixado!');
}

// Sincronizar: carregar do JSON remoto
export async function syncFromRemote(): Promise<number> {
  try {
    const products = await loadProductsFromJSON();
    console.log('[ProductService] Sincronizado do remoto:', products.length, 'produtos');
    return products.length;
  } catch (error) {
    console.error('[ProductService] Erro ao sincronizar:', error);
    throw error;
  }
}

// Importar produtos de JSON
export function importFromJSON(jsonString: string): void {
  try {
    const products = JSON.parse(jsonString);
    
    if (!Array.isArray(products)) {
      throw new Error('JSON inválido: deve ser um array de produtos');
    }

    // Validar estrutura básica
    for (const product of products) {
      if (!product.code || !product.name) {
        throw new Error('JSON inválido: produtos devem ter código e nome');
      }
    }

    saveProducts(products);
  } catch (error) {
    console.error('Erro ao importar JSON:', error);
    throw new Error('Erro ao importar JSON: ' + (error as Error).message);
  }
}

// Inicializar estoque vazio para todas as combinações de cor/tamanho
export function initializeStock(product: Product): StockItem[] {
  const stock: StockItem[] = [];
  
  for (const color of product.colors) {
    for (const size of product.sizes) {
      stock.push({
        color: color.name,
        size,
        quantity: 0,
      });
    }
  }
  
  return stock;
}

// Obter categorias únicas
export function getCategories(): string[] {
  const products = loadProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories).sort();
}

// Obter estatísticas
export interface ProductStats {
  totalProducts: number;
  totalCategories: number;
  averagePrice: number;
  totalStockItems: number;
  lowStockProducts: Product[]; // Produtos com estoque baixo
}

export function getProductStats(): ProductStats {
  const products = loadProducts();
  
  const totalProducts = products.length;
  const totalCategories = getCategories().length;
  const averagePrice = products.length > 0
    ? products.reduce((sum, p) => sum + p.price, 0) / products.length
    : 0;
  
  const totalStockItems = products.reduce((sum, p) => {
    return sum + p.stock.reduce((stockSum, s) => stockSum + s.quantity, 0);
  }, 0);

  // Produtos com estoque total menor que 5
  const lowStockProducts = products.filter(p => {
    const totalStock = p.stock.reduce((sum, s) => sum + s.quantity, 0);
    return totalStock < 5 && totalStock > 0;
  });

  return {
    totalProducts,
    totalCategories,
    averagePrice,
    totalStockItems,
    lowStockProducts,
  };
}
