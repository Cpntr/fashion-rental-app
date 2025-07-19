// src\components\DressCard.tsx
import React, { useState } from "react";
import { Heart, Star } from "lucide-react";

interface Dress {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  image: string;
  rating: number;
  reviews: number;
}
interface Props {
  dress: Dress;
  onFavorite: (id: number, fav: boolean) => void;
}

const DressCard: React.FC<Props> = ({ dress, onFavorite }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [fav, setFav] = useState(false);

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFav(!fav);
    onFavorite(dress.id, !fav);
  };

  return (
     <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden
                 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                 flex flex-col min-h-[480px]"
    >
      {/* ───── Image Section ───── */}
      <div className="relative h-64 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin h-8 w-8 border-b-2 border-pink-500 rounded-full" />
          </div>
        )}
        <img
          src={dress.image}
          alt={dress.name}
          className={`w-full h-full object-cover transition-opacity ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Fav & Type badge */}
        <button
          onClick={toggleFav}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full backdrop-blur-sm"
        >
          <Heart
            className={`w-5 h-5 ${
              fav ? "fill-pink-500 text-pink-500" : "text-gray-400"
            }`}
          />
        </button>

        <div className="absolute top-3 left-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
          {dress.type}
        </div>
      </div>

      {/* ───── Content Section ───── */}
      <div className="p-5 flex flex-col justify-between flex-1">
        {/* Title + Desc */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {dress.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {dress.description}
          </p>
        </div>

        {/* Ratings */}
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < dress.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-gray-500 text-sm ml-2">
            ({dress.reviews})
          </span>
        </div>

         <div className="flex justify-center items-center">
         <span className="text-xl font-bold text-pink-500">
               ₹{dress.price}/day
               </span>
            </div>


        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2">
         
          <button
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white
                       px-4 py-2 rounded-full font-semibold text-sm
                       hover:from-pink-600 hover:to-orange-600 transition
                       transform hover:scale-105 min-w-12/12"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DressCard;
