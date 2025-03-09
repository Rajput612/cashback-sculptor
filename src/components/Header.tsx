
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full py-6 px-4 md:px-8 flex items-center justify-between z-10",
      className
    )}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-semibold">+</span>
          </div>
          <div className="absolute -top-1 -left-1 w-8 h-8 bg-primary/20 rounded-lg animate-pulse-subtle"></div>
        </div>
        <h1 className="text-xl font-medium bg-clip-text">
          <span className="font-bold text-primary">Credit</span>
          <span className="text-primary">+</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm text-foreground/80 hover:text-primary transition-colors">How it works</a>
        <a href="#" className="text-sm text-foreground/80 hover:text-primary transition-colors">Card Library</a>
        <a href="#" className="text-sm text-foreground/80 hover:text-primary transition-colors">About us</a>
      </nav>
      
      <div className="flex items-center gap-3">
        <button className="hidden md:block px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
          Sign in
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
