import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { SheetDebugger } from './components/SheetDebugger';
import { SetupGuide } from './components/SetupGuide';
import { Product, CartItem } from './types';
import { initializeProducts, getCategories } from './services/productService';
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
      
      // Inicializar: carrega do JSON se localStorage estiver vazio
      const data = await initializeProducts();

      if (data.length === 0) {
        setError('Nenhum produto encontrado. Acesse o painel admin para cadastrar produtos.');
      } else {
        setProducts(data);
        setCategories(getCategories());
        // Remover toast automático no carregamento inicial
        if (products.length > 0) {
          setToast({ message: `${data.length} produtos carregados!`, type: 'success' });
        }
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

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-cyan-700 mb-2">Coleção Verão</h1>
          <p className="text-gray-600">Moda praia e fitness com estilo</p>
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

      {/* Debug tool - remove in production */}
      <SheetDebugger />
      <SetupGuide />
    </div>
  );
}