import { ShoppingBag, ChevronDown, Waves, Dumbbell, Sparkles, Search } from 'lucide-react';
import logo from 'figma:asset/aa6121daf68b09f17e5bc1048d328fc8bdf13f74.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  categories: string[];
  onSelectCategory: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ cartItemCount, onCartClick, categories, onSelectCategory, searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('all')}>
              <img src={logo} alt="Coral Fit" className="h-16 w-16 object-contain" />
              <div>
                <h2 className="text-cyan-700">Coral Fit</h2>
                <p className="text-gray-600 text-sm">Moda Praia e Fitness</p>
              </div>
            </div>

            {/* Submenus / Categorias */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 outline-none shadow-sm hover:shadow-md">
                <span className="text-cyan-700 font-semibold text-sm">Categorias</span>
                <ChevronDown className="w-4 h-4 text-cyan-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 bg-white/80 backdrop-blur-2xl border-cyan-100 shadow-2xl rounded-2xl">
                <DropdownMenuItem 
                  onClick={() => onSelectCategory('all')}
                  className="rounded-lg px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 mb-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Todas</div>
                      <div className="text-xs text-gray-500">Ver todos os produtos</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                {categories.map((cat) => {
                  const isFitness = cat.toLowerCase().includes('fitness');
                  const isPraia = cat.toLowerCase().includes('praia');
                  
                  return (
                    <DropdownMenuItem 
                      key={cat} 
                      onClick={() => onSelectCategory(cat)}
                      className="rounded-lg px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 mb-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                          isFitness 
                            ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                            : isPraia
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          {isFitness ? (
                            <Dumbbell className="w-5 h-5 text-white" />
                          ) : isPraia ? (
                            <Waves className="w-5 h-5 text-white" />
                          ) : (
                            <Sparkles className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 capitalize">{cat}</div>
                          <div className="text-xs text-gray-500">
                            {isFitness ? 'Roupas para treino' : isPraia ? 'Roupas de praia' : 'Ver produtos'}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Campo de Busca */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3 px-4 h-10 rounded-xl border border-gray-200 bg-gray-50/50 focus-within:bg-white focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-200 transition-all duration-300">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 text-sm leading-none outline-none"
              />
            </div>
          </div>

          <button
            onClick={onCartClick}
            className="relative p-3 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

