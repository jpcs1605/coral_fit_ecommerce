import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';
import logo from 'figma:asset/aa6121daf68b09f17e5bc1048d328fc8bdf13f74.png';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function SearchInput({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 36, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb', flex: 1, minWidth: 0 }}>
      <Search style={{ width: 15, height: 15, color: '#9ca3af', flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar produtos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#374151', minWidth: 0 }}
      />
    </div>
  );
}

export function Header({ cartItemCount, onCartClick, onLogoClick, searchTerm, onSearchChange }: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const toggleMobileSearch = () => {
    if (mobileSearchOpen) onSearchChange('');
    setMobileSearchOpen(v => !v);
  };

  return (
    <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 40 }}>

      {/* ── Linha 1: logo + nome + [desktop: search] + [mobile: lupa] + cart ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 6px' }}>

        {/* Logo + nome */}
        <button
          onClick={onLogoClick}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <img src={logo} alt="Coral Fit" className="header-logo" />
          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <p style={{ color: '#0e7490', fontWeight: 700, fontSize: 15, margin: 0 }}>Coral Fit</p>
            <p className="header-brand-sub" style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>Moda Praia e Fitness</p>
          </div>
        </button>

        {/* Desktop: search (aparece via CSS @media) */}
        <div className="header-desktop-row">
          <SearchInput value={searchTerm} onChange={onSearchChange} />
        </div>

        {/* Spacer — empurra ícones para direita no mobile */}
        <div style={{ flex: 1 }} />

        {/* Mobile: botão lupa (some no desktop via CSS) */}
        <button
          className="header-search-toggle"
          onClick={toggleMobileSearch}
          aria-label="Buscar produtos"
          style={{ padding: 10, borderRadius: '50%', background: mobileSearchOpen ? 'linear-gradient(135deg,#06b6d4,#0891b2)' : '#f3f4f6', border: 'none', cursor: 'pointer', flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}
        >
          {mobileSearchOpen
            ? <X style={{ width: 18, height: 18, color: '#fff' }} />
            : <Search style={{ width: 18, height: 18, color: '#0891b2' }} />}
        </button>

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

      {/* ── Linha 2: mobile — search expansível (some no desktop via CSS) ── */}
      {mobileSearchOpen && (
        <div className="header-mobile-row">
          <SearchInput value={searchTerm} onChange={onSearchChange} autoFocus />
        </div>
      )}

    </header>
  );
}
