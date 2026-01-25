export interface Product {
  id: string;
  code: string; // Código único do produto
  name: string;
  price: number;
  pricePaid?: number; // Valor pago (histórico)
  image: string; // Imagem principal (mantida para compatibilidade)
  images: string[]; // Múltiplas imagens
  category: string;
  colors: Color[];
  sizes: string[];
  description: string; // Descrição completa
  tags: string[];
  stock: StockItem[]; // Estoque por cor e tamanho
  createdAt: string;
  updatedAt: string;
}

export interface Color {
  name: string;
  hex: string;
}

export interface StockItem {
  color: string;
  size: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryType: 'pickup' | 'delivery';
}

export interface Coupon {
  id: string;
  code: string; // Código do cupom (ex: VERAO2024)
  discount: number; // Valor do desconto
  discountType: 'percentage' | 'fixed'; // Tipo: porcentagem ou valor fixo
  expiryDate: string; // Data de validade (ISO string)
  isActive: boolean; // Se o cupom está ativo
  minPurchaseAmount?: number; // Valor mínimo de compra (opcional)
  maxDiscount?: number; // Desconto máximo (para porcentagem)
  usageLimit?: number; // Limite de usos totais
  usageCount: number; // Contador de usos
  createdAt: string;
  updatedAt: string;
}
