import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h2>Seu Carrinho</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-gray-800 mb-2">Carrinho vazio</h3>
            <p className="text-gray-500">Adicione produtos para começar</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.color}-${item.size}`}
                  className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-100"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-gray-800">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span>Cor: {item.color}</span>
                        <span className="mx-2">•</span>
                        <span>Tamanho: {item.size}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="p-1 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <span className="text-cyan-600">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Total</span>
                <span className="text-cyan-600">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-4 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Finalizar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
