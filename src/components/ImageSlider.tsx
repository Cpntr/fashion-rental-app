// src/components/ImageSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slides } from '../constants/constant';

const AUTO_SLIDE_MS = 5_000;

const ImageSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ───── Auto‑advance (pause on hover) ───── */
  const resetAutoSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setCurrent((p) => (p + 1) % slides.length),
      AUTO_SLIDE_MS,
    );
  };

  useEffect(() => {
    resetAutoSlide();

    // ✅ always return void
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current]);

  /* ───── Handlers ───── */
  const go = (i: number) => setCurrent(i);

  return (
    <div
      className="relative h-96 md:h-[500px] overflow-hidden rounded-3xl shadow-2xl group"
      onMouseEnter={() => timeoutRef.current && clearTimeout(timeoutRef.current)}
      onMouseLeave={resetAutoSlide}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            current === i ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Lazy‑loaded background image */}
          <img
            src={s.image}
            alt={s.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            className="w-full h-full object-cover object-center scale-110
                       animate-kenburns"
          />

          {/* Gradient overlay + caption */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3">
              {s.title}
            </h1>
            <p className="text-lg md:text-2xl text-gray-200">{s.subtitle}</p>
          </div>
        </div>
      ))}

      {/* ───── Arrows ───── */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm
                   hover:bg-white/30 text-white p-2 rounded-full shadow-lg
                   transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm
                   hover:bg-white/30 text-white p-2 rounded-full shadow-lg
                   transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* ───── Dots ───── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-3 w-3 rounded-full transition-colors duration-300
              ${current === i ? 'bg-pink-500 scale-110 shadow' : 'bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
