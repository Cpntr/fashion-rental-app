import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=600&fit=crop",
    title: "Elegant Indian Wear",
    subtitle: "Traditional meets contemporary",
  },
  {
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=600&fit=crop",
    title: "Designer Western Dresses",
    subtitle: "Style that speaks volumes",
  },
  {
    image: "https://images.unsplash.com/photo-1566479179817-0d7e4c9a3a6e?w=1200&h=600&fit=crop",
    title: "Wedding Collection",
    subtitle: "Make your special day unforgettable",
  },
];

const ImageSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5_000);
    return () => clearInterval(t);
  }, []);

  const go = (i: number) => setCurrent(i);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${current === i ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center justify-center h-full text-center text-white">
            <div className="px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{s.title}</h1>
              <p className="text-lg md:text-2xl opacity-90">{s.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>
      <button
        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`w-3 h-3 rounded-full transition-all ${current === i ? "bg-pink-500" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
