import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-end p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className={`inline-block w-fit text-xs px-3 py-1 rounded-full mb-3 ${
              product.category === 'fitness' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-cyan-100 text-cyan-700'
            }`}>
              {product.category === 'fitness' ? 'Fitness' : 'Praia'}
            </span>

            <h2 className="text-gray-800 mb-3">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="text-cyan-600 mb-6">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Cor</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative group`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full transition-all ${
                        selectedColor === color.name
                          ? 'ring-4 ring-cyan-500 ring-offset-2'
                          : 'ring-2 ring-gray-200 hover:ring-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 mb-3">Tamanho</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl transition-all ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={showSuccess}
              className={`w-full py-4 rounded-xl text-white transition-all duration-300 ${
                showSuccess
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {showSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Adicionado ao Carrinho!
                </span>
              ) : (
                'Adicionar ao Carrinho'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
