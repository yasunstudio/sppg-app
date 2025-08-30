import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
}
