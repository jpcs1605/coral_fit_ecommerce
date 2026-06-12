import { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='%23d1d5db'%3E👗%3C/text%3E%3C/svg%3E";

// Paleta completa para badges de categoria — pastéis e tons vivos bem diferenciados.
const CATEGORY_PALETTE: { bg: string; color: string; label?: string }[] = [
  // — Família Turquesa / Ciano (brand) —
  { bg: '#ecfeff', color: '#0e7490', label: 'turquesa claro' },
  { bg: '#cffafe', color: '#0891b2', label: 'ciano' },
  { bg: '#a5f3fc', color: '#0e7490', label: 'ciano médio' },
  { bg: '#e0f7fa', color: '#006064', label: 'teal claro' },
  { bg: '#b2ebf2', color: '#00838f', label: 'teal médio' },

  // — Família Azul —
  { bg: '#dbeafe', color: '#1d4ed8', label: 'azul bebê' },
  { bg: '#bfdbfe', color: '#1e40af', label: 'azul céu' },
  { bg: '#dbeafe', color: '#1e3a8a', label: 'royal blue' },
  { bg: '#e0e7ff', color: '#3730a3', label: 'índigo' },
  { bg: '#eef2ff', color: '#4f46e5', label: 'azul lavanda' },
  { bg: '#ede9fe', color: '#4338ca', label: 'azul violeta' },

  // — Família Lilás / Roxo —
  { bg: '#f3e8ff', color: '#7e22ce', label: 'lilás' },
  { bg: '#ede9fe', color: '#6d28d9', label: 'violeta' },
  { bg: '#f5f3ff', color: '#5b21b6', label: 'lavanda' },
  { bg: '#faf5ff', color: '#7c3aed', label: 'uva claro' },

  // — Família Rosa —
  { bg: '#fce7f3', color: '#be185d', label: 'rosa bebê' },
  { bg: '#fdf2f8', color: '#9d174d', label: 'rosa quente' },
  { bg: '#fce7f3', color: '#db2777', label: 'pink' },
  { bg: '#fff0f3', color: '#c2185b', label: 'rosa chiclete' },
  { bg: '#ffdde1', color: '#ad1457', label: 'rosa escuro' },

  // — Família Coral / Pêssego —
  { bg: '#fff1f0', color: '#c2410c', label: 'coral' },
  { bg: '#ffe4e6', color: '#be123c', label: 'salmão' },
  { bg: '#fff7ed', color: '#c2410c', label: 'pêssego' },
  { bg: '#fef3c7', color: '#b45309', label: 'âmbar' },

  // — Família Vermelho —
  { bg: '#fef2f2', color: '#991b1b', label: 'vermelho claro' },
  { bg: '#fee2e2', color: '#b91c1c', label: 'vermelho' },
  { bg: '#fecaca', color: '#7f1d1d', label: 'vermelho escuro' },

  // — Família Laranja —
  { bg: '#fff7ed', color: '#ea580c', label: 'laranja bebê' },
  { bg: '#ffedd5', color: '#c2410c', label: 'laranja' },
  { bg: '#fed7aa', color: '#9a3412', label: 'laranja escuro' },

  // — Família Amarelo / Dourado —
  { bg: '#fefce8', color: '#854d0e', label: 'amarelo claro' },
  { bg: '#fef9c3', color: '#92400e', label: 'dourado' },
  { bg: '#fde68a', color: '#78350f', label: 'mel' },

  // — Família Verde —
  { bg: '#f0fdf4', color: '#15803d', label: 'verde bebê' },
  { bg: '#d1fae5', color: '#065f46', label: 'menta' },
  { bg: '#bbf7d0', color: '#14532d', label: 'verde claro' },
  { bg: '#e3f6f5', color: '#00695c', label: 'verde sálvia' },
  { bg: '#dcfce7', color: '#166534', label: 'verde médio' },

  // — Família Verde Musgo / Lima —
  { bg: '#f7fee7', color: '#3f6212', label: 'lima' },
  { bg: '#ecfccb', color: '#365314', label: 'verde lima' },

  // — Neutros Elegantes —
  { bg: '#f1f5f9', color: '#334155', label: 'cinza azulado' },
  { bg: '#f8fafc', color: '#475569', label: 'cinza névoa' },
  { bg: '#f5f5f4', color: '#44403c', label: 'cinza quente' },
  { bg: '#fafaf9', color: '#57534e', label: 'off-white' },
];

function categoryColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const badgeColor = categoryColor(product.category);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      {/* Imagem */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f3f4f6' }}>
        {/* Skeleton shimmer enquanto carrega */}
        {!imgLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        )}
        <img
          src={imgError || !product.image ? PLACEHOLDER : product.image}
          alt={product.name}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          style={{
            width: '100%', height: '100%', objectFit: imgError ? 'contain' : 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        {/* Overlay hover */}
        <div
          className="group-hover-overlay"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.25s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '0'}
        >
          <div style={{
            background: '#fff', color: '#0891b2', padding: '6px 14px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            <ShoppingCart style={{ width: 14, height: 14 }} />
            Ver Detalhes
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Badge categoria */}
        <span style={{
          alignSelf: 'flex-start',
          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
          background: badgeColor.bg,
          color: badgeColor.color,
        }}>
          {product.category}
        </span>

        {/* Nome */}
        <p style={{
          color: '#1f2937', fontSize: 12, fontWeight: 500, lineHeight: 1.3,
          margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.name}
        </p>

        {/* Descritivo */}
        {product.description && (
          <p style={{
            color: '#6b7280', fontSize: 11, lineHeight: 1.4,
            margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        {/* Cores */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {product.colors.slice(0, 4).map((color, i) => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              background: color.hex, border: '1px solid rgba(0,0,0,0.12)',
              flexShrink: 0,
            }} title={color.name} />
          ))}
          {product.colors.length > 4 && (
            <span style={{ fontSize: 10, color: '#9ca3af' }}>+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Preço */}
        <p style={{ color: '#0891b2', fontWeight: 700, fontSize: 13, margin: 0 }}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </div>
  );
}
