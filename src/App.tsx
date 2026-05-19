import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { Product, CartItem } from './types';
import { loadProductsAsync, getCategories } from './services/productService';
import { Toast } from './components/Toast';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Product Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadProducts();

    // Listener para mudanças no localStorage (quando admin atualiza)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'coral_fit_products') {
        loadProducts();
      }
    };

    // Listener customizado para mudanças na mesma aba
    const handleProductUpdate = () => {
      loadProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleProductUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleProductUpdate);
    };
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loadProductsAsync();

      if (data.length === 0) {
        setError('Nenhum produto encontrado. Acesse o painel admin para cadastrar produtos.');
      } else {
        setProducts(data);
        setCategories(getCategories());
      }
    } catch (err) {
      setError('Erro ao carregar produtos.');
      setToast({ message: 'Erro ao carregar produtos', type: 'error' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product, color: string, size: string) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.color === color && item.size === size
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cartItems];
      newCart[existingItemIndex].quantity += 1;
      setCartItems(newCart);
    } else {
      setCartItems([...cartItems, { product, color, size, quantity: 1 }]);
    }
    setCartOpen(true);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity === 0) {
      removeItem(index);
      return;
    }
    const newCart = [...cartItems];
    newCart[index].quantity = quantity;
    setCartItems(newCart);
  };

  const removeItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        categories={categories}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 12px' }}>
        <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 8 }}>
          <h1 style={{ color: '#0e7490', marginBottom: 4, fontSize: 'clamp(1.4rem, 5vw, 2.5rem)' }}>Coleção Verão</h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>Moda praia e fitness com estilo</p>
        </div>

        <ProductGrid
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          loading={loading}
          error={error}
          onRefresh={loadProducts}
          onAddToCart={addToCart}
          searchTerm={searchTerm}
        />
      </main>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onSuccess={() => {
          setCartItems([]);
          setCheckoutOpen(false);
          setToast({ message: 'Pedido realizado com sucesso!', type: 'success' });
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}