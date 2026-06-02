import { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { Toast } from './Toast';
import { Product } from '../types';
import { RefreshCw, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const PAGE_SIZE = 8;

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
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownAnchor, setDropdownAnchor] = useState<{ top: number; left: number } | null>(null);
  const [page, setPage] = useState(1);
  const filtersRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSubCatResetRef = useRef(false);

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setDropdownAnchor(null);
    }, 150);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Volta para a primeira página e reseta sub-categoria ao mudar categoria ou busca
  // Não fecha o dropdown aqui — ele é gerenciado pelo próprio clique no botão
  useEffect(() => {
    setPage(1);
    if (skipSubCatResetRef.current) {
      skipSubCatResetRef.current = false;
    } else {
      setSelectedSubCategory('all');
    }
  }, [selectedCategory, searchTerm]);

  // Fecha dropdown ao clicar fora ou ao rolar a página
  useEffect(() => {
    const close = () => { setOpenDropdown(null); setDropdownAnchor(null); };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideFilters = filtersRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideFilters && !insideDropdown) close();
    };
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('scroll', close, true);
    };
  }, []);

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

  // Sub-categorias disponíveis para a categoria selecionada
  const subCategories = selectedCategory === 'all'
    ? []
    : [...new Set(
        products
          .filter(p => p.category === selectedCategory && p.subCategory)
          .map(p => p.subCategory!)
      )].sort();

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Filter by sub-category
  const subFilteredProducts = selectedSubCategory === 'all'
    ? filteredProducts
    : filteredProducts.filter(p => p.subCategory === selectedSubCategory);

  // Apply search filter
  const searchFilteredProducts = searchTerm.trim()
    ? subFilteredProducts.filter(product => {
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
    : subFilteredProducts;

  return (
    <>
      <div ref={filtersRef} className="category-filters" style={{ position: 'relative', alignItems: 'flex-start' }}>
        {[{ key: 'all', label: `Todos (${products.length})` }, ...categories.map(c => ({ key: c, label: `${c} (${products.filter(p => p.category === c).length})` }))].map(({ key, label }) => {
          const active = selectedCategory === key;
          const catSubCategories = key === 'all' ? [] : [...new Set(
            products.filter(p => p.category === key && p.subCategory).map(p => p.subCategory!)
          )].sort();
          const hasSubCats = catSubCategories.length > 0;
          const isOpen = openDropdown === key;

          return (
            <div
              key={key}
              style={{ position: 'relative', flexShrink: 0 }}
              onMouseEnter={(e) => {
                if (!hasSubCats) return;
                cancelClose();
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setDropdownAnchor({ top: rect.bottom + 6, left: rect.left });
                setOpenDropdown(key);
              }}
              onMouseLeave={() => {
                if (hasSubCats) scheduleClose();
              }}
            >
              <button
                onClick={() => {
                  setSelectedSubCategory('all');
                  onSelectCategory(key);
                  if (!hasSubCats) {
                    setOpenDropdown(null);
                    setDropdownAnchor(null);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
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
                {hasSubCats && (
                  <ChevronDown style={{
                    width: 13,
                    height: 13,
                    opacity: 0.8,
                  }} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Dropdown de sub-categorias — fixed para não ser cortado pelo overflow do container */}
      {openDropdown && dropdownAnchor && (() => {
        const catSubCategories = [...new Set(
          products.filter(p => p.category === openDropdown && p.subCategory).map(p => p.subCategory!)
        )].sort();
        return (
          <div
            ref={dropdownRef}
            onMouseEnter={() => cancelClose()}
            onMouseLeave={() => scheduleClose()}
            style={{
              position: 'fixed',
              top: dropdownAnchor.top,
              left: dropdownAnchor.left,
              zIndex: 9999,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.13)',
              padding: '6px 0',
              minWidth: 180,
              overflow: 'hidden',
            }}
          >
            {catSubCategories.map(sc => {
              const scActive = selectedSubCategory === sc;
              const count = products.filter(p => p.category === openDropdown && p.subCategory === sc).length;
              return (
                <button
                  key={sc}
                  onClick={() => { skipSubCatResetRef.current = true; onSelectCategory(openDropdown!); setSelectedSubCategory(sc); setPage(1); setOpenDropdown(null); setDropdownAnchor(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: scActive ? 600 : 400,
                    background: scActive ? '#f0f9ff' : 'transparent',
                    color: scActive ? '#0891b2' : '#374151',
                    border: 'none',
                    borderLeft: scActive ? '3px solid #0891b2' : '3px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 8,
                  }}
                >
                  <span>{sc}</span>
                  <span style={{
                    fontSize: 11,
                    color: scActive ? '#0891b2' : '#9ca3af',
                    background: scActive ? '#e0f2fe' : '#f3f4f6',
                    borderRadius: 999,
                    padding: '1px 7px',
                    fontWeight: 500,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {searchFilteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-600 text-lg mb-2">Nenhum produto encontrado</p>
          <p className="text-gray-500 text-sm">Tente ajustar sua busca ou filtros</p>
        </div>
      ) : (() => {
        const totalPages = Math.ceil(searchFilteredProducts.length / PAGE_SIZE);
        const pageItems = searchFilteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        return (
          <>
            <div className="product-grid">
              {pageItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '24px 0 16px' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb',
                    background: page === 1 ? '#f9fafb' : '#fff', cursor: page === 1 ? 'default' : 'pointer',
                    color: page === 1 ? '#d1d5db' : '#0891b2',
                  }}
                >
                  <ChevronLeft style={{ width: 18, height: 18 }} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', border: 'none',
                      background: n === page ? 'linear-gradient(135deg,#06b6d4,#0891b2)' : '#f3f4f6',
                      color: n === page ? '#fff' : '#374151',
                      fontWeight: n === page ? 700 : 400,
                      fontSize: 13, cursor: 'pointer',
                      boxShadow: n === page ? '0 2px 8px rgba(6,182,212,0.35)' : 'none',
                    }}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb',
                    background: page === totalPages ? '#f9fafb' : '#fff', cursor: page === totalPages ? 'default' : 'pointer',
                    color: page === totalPages ? '#d1d5db' : '#0891b2',
                  }}
                >
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </button>
              </div>
            )}
          </>
        );
      })()}

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