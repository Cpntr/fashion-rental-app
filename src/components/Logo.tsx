// src\components\Logo.tsx
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src="/logo.png"
      alt="Fashion Rental Logo"
      className="h-[40px] w-auto object-contain"
    />
  </div>
);

export default Logo;
