import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-2 left-2 right-2 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-full bg-white text-cyan-600 py-2 text-sm rounded-full flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors">
            <ShoppingCart className="w-4 h-4" />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      <div className="p-3 h-32 flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            product.category === 'fitness' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-cyan-100 text-cyan-700'
          }`}>
            {product.category === 'fitness' ? 'Fitness' : 'Praia'}
          </span>
        </div>

        <h3 className="text-gray-800 text-sm mb-1.5 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-1.5 mb-2">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
          )}
        </div>

        <p className="text-cyan-600 font-semibold text-sm mt-auto">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </div>
  );
}
