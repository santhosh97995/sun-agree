import React from 'react';

export const MantisIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Head */}
    <circle cx="12" cy="5" r="2" />
    {/* Body */}
    <path d="M12 7v8" />
    {/* Front legs (folded) */}
    <path d="M12 8l-4 2l2 4" />
    <path d="M12 8l4 2l-2 4" />
    {/* Back legs */}
    <path d="M12 15l-4 4" />
    <path d="M12 15l4 4" />
    {/* Antennae */}
    <path d="M11 3l-2-2" />
    <path d="M13 3l2-2" />
  </svg>
);
