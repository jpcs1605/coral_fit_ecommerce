import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { Toast } from './Toast';
import { Product } from '../types';
import { RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  searchTerm: string;
}

export function ProductGrid({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  loading,
  error,
  onRefresh,
  onAddToCart,
  searchTerm
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Erro ao carregar produtos</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={onRefresh}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
            <a
              href="/coral_fit_ecommerce/admin.html"
              className="block bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Acessar Painel Admin
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-gray-800 font-semibold text-lg mb-2">Nenhum produto cadastrado</h3>
          <p className="text-gray-600 mb-6">
            Use o painel administrativo para cadastrar seus produtos e começar a vender!
          </p>
          <a
            href="/coral_fit_ecommerce/admin.html"
            className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
          >
            Acessar Painel Admin
          </a>
        </div>
      </div>
    );
  }

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Apply search filter
  const searchFilteredProducts = searchTerm.trim()
    ? filteredProducts.filter(product => {
        const searchLower = searchTerm.toLowerCase().trim();
        
        // Buscar no nome do produto
        if (product.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Buscar no preço (permitir busca por "50" ou "50.00" etc)
        if (product.price.toString().includes(searchLower)) {
          return true;
        }
        
        // Buscar nas cores
        if (product.colors.some(color => color.name.toLowerCase().includes(searchLower))) {
          return true;
        }
        
        // Buscar nos tamanhos
        if (product.sizes.some(size => size.toLowerCase().includes(searchLower))) {
          return true;
        }
        
        // Buscar nas tags
        if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return true;
        }
        
        // Buscar na descrição
        if (product.description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        return false;
      })
    : filteredProducts;

  return (
    <>
      <div className="category-filters">
        {[{ key: 'all', label: `Todos (${products.length})` }, ...categories.map(c => ({ key: c, label: `${c} (${products.filter(p => p.category === c).length})` }))].map(({ key, label }) => {
          const active = selectedCategory === key;
          return (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                border: active ? 'none' : '1px solid #e5e7eb',
                background: active ? 'linear-gradient(to right,#06b6d4,#0891b2)' : '#fff',
                color: active ? '#fff' : '#374151',
                cursor: 'pointer',
                boxShadow: active ? '0 2px 8px rgba(6,182,212,0.35)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {searchFilteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-600 text-lg mb-2">Nenhum produto encontrado</p>
          <p className="text-gray-500 text-sm">Tente ajustar sua busca ou filtros</p>
        </div>
      ) : (
        <div className="product-grid mb-16">
          {searchFilteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}