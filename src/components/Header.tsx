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

function CategoriesDropdown({
  categories,
  onSelectCategory,
  align = 'start',
}: {
  categories: string[];
  onSelectCategory: (cat: string) => void;
  align?: 'start' | 'end';
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 12, outline: 'none', background: 'linear-gradient(to right, #ecfeff, #eff6ff)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', flexShrink: 0 }}
      >
        <span style={{ color: '#0e7490', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>Categorias</span>
        <ChevronDown style={{ width: 14, height: 14, color: '#0e7490' }} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className="w-56 p-2 bg-white border-cyan-100 shadow-2xl rounded-2xl"
        style={{ zIndex: 9999 }}
      >
        <DropdownMenuItem
          onClick={() => onSelectCategory('all')}
          className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-cyan-50 transition-all mb-1"
        >
          <div className="flex items-center gap-2">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles style={{ width: 14, height: 14, color: '#fff' }} />
            </div>
            <span style={{ fontWeight: 600, color: '#1f2937', fontSize: 14 }}>Todas</span>
          </div>
        </DropdownMenuItem>

        {categories.map((cat) => {
          const isFitness = cat.toLowerCase().includes('fitness');
          const isPraia = cat.toLowerCase().includes('praia');
          const bg = isFitness
            ? 'linear-gradient(135deg,#f97316,#ef4444)'
            : isPraia
            ? 'linear-gradient(135deg,#06b6d4,#3b82f6)'
            : 'linear-gradient(135deg,#9ca3af,#6b7280)';
          return (
            <DropdownMenuItem
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-cyan-50 transition-all mb-1"
            >
              <div className="flex items-center gap-2">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isFitness ? <Dumbbell style={{ width: 14, height: 14, color: '#fff' }} />
                    : isPraia ? <Waves style={{ width: 14, height: 14, color: '#fff' }} />
                    : <Sparkles style={{ width: 14, height: 14, color: '#fff' }} />}
                </div>
                <span style={{ fontWeight: 600, color: '#1f2937', fontSize: 14, textTransform: 'capitalize' }}>{cat}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 36, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb', flex: 1, minWidth: 0 }}>
      <Search style={{ width: 15, height: 15, color: '#9ca3af', flexShrink: 0 }} />
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#374151', minWidth: 0 }}
      />
    </div>
  );
}

export function Header({ cartItemCount, onCartClick, categories, onSelectCategory, searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 40 }}>

      {/* ── Linha 1: logo + nome + [desktop: cats + search] + cart ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 6px' }}>

        {/* Logo + nome */}
        <button
          onClick={() => onSelectCategory('all')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <img src={logo} alt="Coral Fit" className="header-logo" />
          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <p style={{ color: '#0e7490', fontWeight: 700, fontSize: 15, margin: 0 }}>Coral Fit</p>
            <p className="header-brand-sub" style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>Moda Praia e Fitness</p>
          </div>
        </button>

        {/* Desktop: categorias + search (aparece via CSS @media) */}
        <div className="header-desktop-row">
          <CategoriesDropdown categories={categories} onSelectCategory={onSelectCategory} />
          <SearchInput value={searchTerm} onChange={onSearchChange} />
        </div>

        {/* Spacer — empurra carrinho para direita no mobile */}
        <div style={{ flex: 1 }} />

        {/* Carrinho */}
        <button
          onClick={onCartClick}
          style={{ position: 'relative', padding: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#0891b2)', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(6,182,212,0.4)' }}
        >
          <ShoppingBag style={{ width: 20, height: 20, color: '#fff' }} />
          {cartItemCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Linha 2: mobile — search + categorias (some no desktop via CSS) ── */}
      <div className="header-mobile-row">
        <SearchInput value={searchTerm} onChange={onSearchChange} />
        <CategoriesDropdown categories={categories} onSelectCategory={onSelectCategory} align="end" />
      </div>

    </header>
  );
}
