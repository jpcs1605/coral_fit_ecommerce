export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colors: Color[];
  sizes: string[];
  description: string;
}

export interface Color {
  name: string;
  hex: string;
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
  address: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryType: 'pickup' | 'delivery';
}
