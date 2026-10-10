"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className={pathname === '/' ? 'flex-1 flex flex-col' : 'flex-1 flex flex-col'}>
      {children}
    </div>
  );
}
