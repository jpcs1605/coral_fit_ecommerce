import { Coupon } from '../types';


const STORAGE_KEY = 'coral_fit_coupons';
// URL do arquivo JSON no GitHub (raw)
const COUPONS_JSON_URL = 'https://raw.githubusercontent.com/jpcs1605/coral_fit_ecommerce/main/public/coupons.json';
// Fallback para arquivo local
const COUPONS_JSON_URL_LOCAL = '/coupons.json';

// Função para carregar cupons do arquivo JSON (GitHub ou local)
async function loadCouponsFromJSON(): Promise<Coupon[]> {
  try {
    // Tenta primeiro do GitHub
    console.log('[CouponService] Buscando cupons do GitHub...');
    let response = await fetch(COUPONS_JSON_URL);
    // Se falhar, tenta do arquivo local
    if (!response.ok) {
      console.warn('Falha ao buscar do GitHub, tentando arquivo local...');
      response = await fetch(COUPONS_JSON_URL_LOCAL);
    }
    if (!response.ok) {
      console.warn('Arquivo coupons.json não encontrado');
      return [];
    }
    const coupons = await response.json();
    console.log('[CouponService] ✓ Cupons carregados do JSON:', coupons.length);
    return coupons;
  } catch (error) {
    console.error('Erro ao carregar coupons.json:', error);
    return [];
  }
}

// Carregar cupons (async) - busca do GitHub primeiro, localStorage como fallback
export async function loadCouponsAsync(): Promise<Coupon[]> {
  try {
    // SEMPRE tenta buscar do GitHub primeiro
    console.log('[CouponService] Buscando cupons do GitHub...');
    const couponsFromJSON = await loadCouponsFromJSON();
    if (couponsFromJSON.length > 0) {
      // Salva no localStorage para futuras consultas offline
      saveCoupons(couponsFromJSON);
      console.log('[CouponService] ✓ Cupons do GitHub salvos no localStorage');
      return couponsFromJSON;
    }
    // Se falhou ao buscar do GitHub, tenta localStorage como fallback
    console.log('[CouponService] Falha ao buscar do GitHub, usando localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const coupons = JSON.parse(stored);
      if (coupons.length > 0) {
        console.log('[CouponService] Cupons carregados do localStorage (fallback):', coupons.length);
        return coupons;
      }
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar cupons:', error);
    return [];
  }
}

// Carregar cupons do localStorage
export function loadCoupons(): Coupon[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar cupons:', error);
    return [];
  }
}

// Salvar cupons no localStorage
function saveCoupons(coupons: Coupon[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
}

// Gerar ID único
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Criar novo cupom
export function createCoupon(couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Coupon {
  const coupons = loadCoupons();
  
  // Verificar se já existe um cupom com o mesmo código
  const existingCoupon = coupons.find(c => c.code.toUpperCase() === couponData.code.toUpperCase());
  if (existingCoupon) {
    throw new Error('Já existe um cupom com este código');
  }
  
  const newCoupon: Coupon = {
    ...couponData,
    id: generateId(),
    code: couponData.code.toUpperCase(),
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  coupons.push(newCoupon);
  saveCoupons(coupons);
  
  return newCoupon;
}

// Atualizar cupom existente
export function updateCoupon(id: string, updates: Partial<Coupon>): Coupon {
  const coupons = loadCoupons();
  const index = coupons.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error('Cupom não encontrado');
  }
  
  // Se está atualizando o código, verificar se não existe outro com o mesmo código
  if (updates.code && updates.code !== coupons[index].code) {
    const existingCoupon = coupons.find(c => 
      c.id !== id && c.code.toUpperCase() === updates.code!.toUpperCase()
    );
    if (existingCoupon) {
      throw new Error('Já existe um cupom com este código');
    }
    updates.code = updates.code.toUpperCase();
  }
  
  const updatedCoupon = {
    ...coupons[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  coupons[index] = updatedCoupon;
  saveCoupons(coupons);
  
  return updatedCoupon;
}

// Deletar cupom
export function deleteCoupon(id: string): void {
  const coupons = loadCoupons();
  const filtered = coupons.filter(c => c.id !== id);
  
  if (filtered.length === coupons.length) {
    throw new Error('Cupom não encontrado');
  }
  
  saveCoupons(filtered);
}

// Validar cupom para uso
export function validateCoupon(code: string, purchaseAmount: number): {
  isValid: boolean;
  coupon?: Coupon;
  error?: string;
  discountAmount?: number;
} {
  const coupons = loadCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    return { isValid: false, error: 'Cupom não encontrado' };
  }
  
  if (!coupon.isActive) {
    return { isValid: false, error: 'Cupom inativo' };
  }
  
  // Verificar data de validade
  const now = new Date();
  const expiryDate = new Date(coupon.expiryDate);
  if (now > expiryDate) {
    return { isValid: false, error: 'Cupom expirado' };
  }
  
  // Verificar limite de usos
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, error: 'Cupom atingiu o limite de usos' };
  }
  
  // Verificar valor mínimo de compra
  if (coupon.minPurchaseAmount && purchaseAmount < coupon.minPurchaseAmount) {
    return { 
      isValid: false, 
      error: `Valor mínimo de compra: R$ ${coupon.minPurchaseAmount.toFixed(2)}` 
    };
  }
  
  // Calcular desconto
  let discountAmount: number;
  if (coupon.discountType === 'percentage') {
    discountAmount = (purchaseAmount * coupon.discount) / 100;
    // Aplicar desconto máximo se definido
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discount;
  }
  
  // Garantir que o desconto não seja maior que o valor da compra
  if (discountAmount > purchaseAmount) {
    discountAmount = purchaseAmount;
  }
  
  return {
    isValid: true,
    coupon,
    discountAmount,
  };
}

// Registrar uso de cupom
export function useCoupon(code: string): void {
  const coupons = loadCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) {
    throw new Error('Cupom não encontrado');
  }
  
  coupon.usageCount += 1;
  coupon.updatedAt = new Date().toISOString();
  
  saveCoupons(coupons);
}

// Obter cupom por código
export function getCouponByCode(code: string): Coupon | null {
  const coupons = loadCoupons();
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase()) || null;
}

// Obter estatísticas
export function getCouponStats() {
  const coupons = loadCoupons();
  const now = new Date();
  
  return {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.isActive).length,
    expiredCoupons: coupons.filter(c => new Date(c.expiryDate) < now).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usageCount, 0),
  };
}

// Exportar cupons para JSON
export function exportCouponsToJSON(): string {
  const coupons = loadCoupons();
  return JSON.stringify(coupons, null, 2);
}

// Importar cupons de JSON
export function importCouponsFromJSON(json: string): void {
  const coupons = JSON.parse(json);
  
  if (!Array.isArray(coupons)) {
    throw new Error('JSON inválido: deve ser um array de cupons');
  }
  
  saveCoupons(coupons);
}

// Baixar JSON de cupons
export function downloadCouponsJSON(): void {
  const json = exportCouponsToJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `coral-fit-coupons-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
