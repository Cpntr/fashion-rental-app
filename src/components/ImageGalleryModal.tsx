// src\components\ImageGalleryModal.tsx
import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  startIndex?: number;
  onClose: () => void;
}

const ImageGalleryModal: React.FC<Props> = ({ images, startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setVisible(true);

    // ESC‑key support
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // wait for zoom-out
  };

  const prev = () => setIndex((p) => (p - 1 + images.length) % images.length);
  const next = () => setIndex((p) => (p + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center
                 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className={`relative max-w-4xl w-full max-h-[90vh] transition-all duration-300
                   px-4 transform ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute -top-10 right-0 text-white hover:text-pink-400 transition"
          onClick={handleClose}
        >
          <X size={34} />
        </button>

        {/* Image */}
        <img
          src={images[index]}
          alt={`Gallery ${index + 1}`}
          loading="lazy"
          className="w-full max-h-[80vh] h-auto rounded-xl shadow-xl object-contain"
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2
                         bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2
                         bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageGalleryModal;
