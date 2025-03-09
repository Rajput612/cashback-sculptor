import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  
  return (
    <header className={cn(
      "w-full py-6 px-4 md:px-8 flex items-center justify-between z-10",
      className
    )}>
      <Link to="/" className="flex items-center gap-2">
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
      </Link>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link 
          to="/how-it-works" 
          className={cn(
            "text-sm transition-colors",
            location.pathname === '/how-it-works' 
              ? "text-primary font-medium" 
              : "text-foreground/80 hover:text-primary"
          )}
        >
          How it works
        </Link>
        <Link 
          to="/card-library" 
          className={cn(
            "text-sm transition-colors",
            location.pathname === '/card-library' 
              ? "text-primary font-medium" 
              : "text-foreground/80 hover:text-primary"
          )}
        >
          Card Library
        </Link>
        <Link 
          to="/about" 
          className={cn(
            "text-sm transition-colors",
            location.pathname === '/about' 
              ? "text-primary font-medium" 
              : "text-foreground/80 hover:text-primary"
          )}
        >
          About us
        </Link>
      </nav>
      
      <div className="flex items-center gap-3">
        <Link 
          to="/signin"
          className="hidden md:block px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          Sign in
        </Link>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;