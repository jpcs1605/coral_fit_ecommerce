import { useState } from 'react';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const isColorAvailableForSize = (color: string, size: string) =>
    product.stock.some(i => i.color === color && i.size === size && i.quantity > 0);

  const isSizeAvailableForColor = (size: string, color: string) =>
    product.stock.some(i => i.size === size && i.color === color && i.quantity > 0);

  const getInitial = () => {
    for (const c of product.colors)
      for (const s of product.sizes)
        if (isColorAvailableForSize(c.name, s)) return { color: c.name, size: s };
    return { color: product.colors[0]?.name ?? '', size: product.sizes[0] ?? '' };
  };

  const init = getInitial();
  const [selectedColor, setSelectedColor] = useState(init.color);
  const [selectedSize, setSelectedSize] = useState(init.size);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  if (!isOpen) return null;

  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const idx = Math.min(imgIndex, Math.max(0, images.length - 1));
  const unavailable = !isColorAvailableForSize(selectedColor, selectedSize);
  const isFitness = product.category === 'fitness';

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); onClose(); }, 1500);
  };

  /* ── Carrossel de imagem ─────────────────────────────── */
  const ImageBlock = ({ imgWidth }: { imgWidth: number | string }) => (
    <div style={{ width: imgWidth, flexShrink: 0 }}>
      {/* Imagem principal */}
      <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', background: '#f3f4f6', position: 'relative' }}>
        {images[idx] && (
          <img src={images[idx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      {/* Navegação */}
      {images.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft style={{ width: 14, height: 14, color: '#374151' }} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                style={{ width: 6, height: 6, borderRadius: '50%', border: 'none', cursor: 'pointer', background: i === idx ? '#06b6d4' : '#d1d5db', padding: 0 }}
              />
            ))}
          </div>
          <button
            onClick={() => setImgIndex(i => (i + 1) % images.length)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight style={{ width: 14, height: 14, color: '#374151' }} />
          </button>
        </div>
      )}
    </div>
  );

  /* ── Seletores de cor e tamanho ──────────────────────── */
  const Selectors = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Cor */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Cor</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.colors.map(color => {
            const avail = isSizeAvailableForColor(selectedSize, color.name);
            const sel = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: color.hex, position: 'relative', flexShrink: 0,
                  boxShadow: sel
                    ? `0 0 0 3px #fff, 0 0 0 5px #06b6d4`
                    : avail ? '0 0 0 2px #e5e7eb' : '0 0 0 2px #d1d5db',
                  opacity: avail ? 1 : 0.45,
                }}
              >
                {sel && (
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 16, height: 16, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                  </span>
                )}
                {!avail && !sel && (
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }}>
                    <X style={{ width: 12, height: 12, color: '#6b7280' }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tamanho */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Tamanho</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.sizes.map(size => {
            const avail = isColorAvailableForSize(selectedColor, size);
            const sel = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  background: sel ? 'linear-gradient(to right,#06b6d4,#0891b2)' : avail ? '#f3f4f6' : '#f9fafb',
                  color: sel ? '#fff' : avail ? '#374151' : '#9ca3af',
                  boxShadow: sel ? '0 2px 8px rgba(6,182,212,0.35)' : 'none',
                  opacity: avail ? 1 : 0.5,
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aviso indisponível */}
      {unavailable && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: '10px 12px', color: '#92400e', fontSize: 12 }}>
          Combinação indisponível. Escolha outra cor ou tamanho.
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleAdd}
        disabled={showSuccess || unavailable}
        style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: unavailable ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 600, color: '#fff',
          background: showSuccess ? '#22c55e' : unavailable ? '#9ca3af' : 'linear-gradient(to right,#06b6d4,#0891b2)',
          boxShadow: (!showSuccess && !unavailable) ? '0 4px 12px rgba(6,182,212,0.4)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
      >
        {showSuccess
          ? <><Check style={{ width: 18, height: 18 }} /> Colocado no Carrinho!</>
          : 'Colocar no Carrinho'
        }
      </button>
    </div>
  );

  return (
    <div className="modal-overlay fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-sheet bg-white shadow-2xl max-w-4xl w-full" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Header do modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
            background: isFitness ? '#f3e8ff' : '#ecfeff',
            color: isFitness ? '#7e22ce' : '#0e7490',
          }}>
            {isFitness ? 'Fitness' : product.category}
          </span>
          <button
            onClick={onClose}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X style={{ width: 16, height: 16, color: '#374151' }} />
          </button>
        </div>

        {/* Corpo: imagem + info básica lado a lado */}
        <div className="modal-body" style={{ flex: 1, minHeight: 0 }}>
          {/* Imagem */}
          <div className="modal-image-col">
            <ImageBlock imgWidth="100%" />
          </div>

          {/* Info básica (mobile: nome+preço ao lado da imagem; desktop: nome+desc+preço+seletores) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.3 }}>
              {product.name}
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0891b2', margin: 0 }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
            {product.description && (
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description}
              </p>
            )}

            {/* Seletores — visíveis só no desktop (dentro do modal-body) */}
            <div className="modal-selectors" style={{ marginTop: 8 }}>
              <Selectors />
            </div>
          </div>
        </div>

        {/* Seletores — visíveis só no mobile (fora do modal-body) */}
        <div className="modal-selectors-mobile" style={{ padding: '0 12px 16px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ paddingTop: 12 }}>
            <Selectors />
          </div>
        </div>

      </div>
    </div>
  );
}
