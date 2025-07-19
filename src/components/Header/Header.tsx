// src\components\Header\Header.tsx
import React from "react";
import { Menu, X, Download } from "lucide-react";
import Logo from "../Logo";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";

export interface HeaderProps {
  showAbout: boolean;
  setShowAbout: (value: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  showAbout,
  setShowAbout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { deferredPrompt, promptInstall } = useInstallPrompt();

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* ───── Desktop Nav ───── */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setShowAbout(false)}
              className={`font-medium transition-colors ${
                !showAbout ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setShowAbout(true)}
              className={`font-medium transition-colors ${
                showAbout ? "text-pink-500" : "text-gray-700 hover:text-pink-500"
              }`}
            >
              About Us
            </button>

            {/* ───── Install App Button ───── */}
            {deferredPrompt && (
              <button
                onClick={promptInstall}
                className="ml-4 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:from-pink-600 hover:to-orange-600 transition"
              >
                <Download size={16} />
                Install App
              </button>
            )}
          </nav>

          {/* ───── Mobile Burger ───── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ───── Mobile Nav Links ───── */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowAbout(false);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showAbout
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setShowAbout(true);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAbout
                    ? "text-pink-500 bg-pink-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                About Us
              </button>
              {/* Optional: Install Button in mobile menu */}
              {deferredPrompt && (
                <button
                  onClick={() => {
                    promptInstall();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-orange-500 text-white mt-2"
                >
                  <Download size={16} className="inline mr-2" />
                  Install App
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
