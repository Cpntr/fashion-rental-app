import React from "react";
import { ShoppingBag } from "lucide-react";

interface LogoProps { className?: string }

const Logo: React.FC<LogoProps> = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
      <ShoppingBag className="text-white" size={20} />
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
      Fashion Rental
    </span>
  </div>
);

export default Logo;
