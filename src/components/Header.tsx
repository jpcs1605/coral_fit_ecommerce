import { ShoppingBag, ChevronDown } from 'lucide-react';
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
}

export function Header({ cartItemCount, onCartClick, categories, onSelectCategory }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors outline-none">
                <span className="text-gray-700 font-medium">Categorias</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => onSelectCategory('all')}>
                  Todas
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat} onClick={() => onSelectCategory(cat)}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
