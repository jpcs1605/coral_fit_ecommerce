import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isFitness = product.category === 'fitness';

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
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          background: isFitness ? '#f3e8ff' : '#ecfeff',
          color: isFitness ? '#7e22ce' : '#0e7490',
        }}>
          {isFitness ? 'Fitness' : product.category}
        </span>

        {/* Nome */}
        <p style={{
          color: '#1f2937', fontSize: 12, fontWeight: 500, lineHeight: 1.3,
          margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.name}
        </p>

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
