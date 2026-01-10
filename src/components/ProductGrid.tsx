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
}

export function ProductGrid({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  loading,
  error,
  onRefresh,
  onAddToCart
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h3 className="text-red-800 mb-2">Erro ao carregar produtos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600">Nenhum produto disponível no momento</p>
      </div>
    );
  }

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
          Todos ({products.length})
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === category
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            {category} ({products.filter(p => p.category === category).length})
          </button>
        ))}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-full bg-white text-cyan-600 hover:bg-cyan-50 transition-colors shadow-md"
          title="Recarregar produtos da planilha"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

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