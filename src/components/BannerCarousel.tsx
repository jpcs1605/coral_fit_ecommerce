import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerSlide } from '../services/googleSheetsService';

interface BannerCarouselProps {
  slides: BannerSlide[];
}

export function BannerCarousel({ slides }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);

  /* Auto-play */
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next, total]);

  /* Swipe touch */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    else if (delta < -40) next();
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 16,
        background: '#f3f4f6',
        marginBottom: 20,
        userSelect: 'none',
      }}
    >
      {/* Faixa de slides */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'transform',
        }}
      >
        {slides.map((slide, i) => {
          const content = (
            <div
              key={i}
              style={{
                minWidth: '100%',
                position: 'relative',
                aspectRatio: '16/7',
                overflow: 'hidden',
                background: '#e5e7eb',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title ?? `Banner ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {/* Gradiente + título */}
              {slide.title && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
                  display: 'flex', alignItems: 'flex-end', padding: '16px 20px',
                }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(14px, 4vw, 22px)', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                    {slide.title}
                  </p>
                </div>
              )}
            </div>
          );

          return slide.link
            ? <a key={i} href={slide.link} target="_blank" rel="noopener noreferrer" style={{ minWidth: '100%', display: 'block', textDecoration: 'none' }}>{content}</a>
            : <div key={i} style={{ minWidth: '100%' }}>{content}</div>;
        })}
      </div>

      {/* Setas — só se houver mais de 1 slide */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 2,
            }}
          >
            <ChevronLeft style={{ width: 18, height: 18, color: '#374151' }} />
          </button>

          <button
            onClick={next}
            aria-label="Próximo"
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 2,
            }}
          >
            <ChevronRight style={{ width: 18, height: 18, color: '#374151' }} />
          </button>

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6, zIndex: 2,
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? 20 : 7, height: 7,
                  borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === current ? '#06b6d4' : 'rgba(255,255,255,0.7)',
                  transition: 'width 0.3s, background 0.3s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
