// src\components\Footer\Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 text-center py-4 text-sm text-gray-600 border-t border-gray-200">
      <p>© {new Date().getFullYear()} Chandra's Fashion Rental. All rights reserved.</p>
      <p>
        For queries:{" "}
        <a
          href="mailto:cpsharma.ntr@gmail.com"
          className="text-pink-500 hover:underline"
        >
          cpsharma.ntr@gmail.com
        </a>
      </p>
    </footer>
  );
};

export default Footer;
