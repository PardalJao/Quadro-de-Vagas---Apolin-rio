
import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-8 h-20 flex items-center justify-between">
        <button 
          onClick={onLogoClick}
          className="transition-opacity hover:opacity-70"
        >
          <span className="text-xl font-extrabold tracking-tighter text-black uppercase">
            João Apolinário
          </span>
        </button>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors">Visão</a>
          <a href="#" className="text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors">Cultura</a>
          <button onClick={onLogoClick} className="bg-black text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
            Carreiras
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
