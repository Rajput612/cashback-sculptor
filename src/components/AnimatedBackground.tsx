
import React from 'react';
import { cn } from '@/lib/utils';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background opacity-90"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/6 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-blue-100 to-blue-200 opacity-20 blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/6 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-blue-50 to-indigo-100 opacity-20 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-50 to-sky-100 opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmYWZhZmEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBzdHJva2U9IiNlYmViZWIiIHN0cm9rZS13aWR0aD0iLjUiIGQ9Ik0wIDYwaDYwTTYwIDBWNjAiLz48L2c+PC9zdmc+')] opacity-10"></div>
    </div>
  );
};

export default AnimatedBackground;
