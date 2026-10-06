"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
      ? "text-emerald-600 dark:text-emerald-400 font-bold"
      : "hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors";
  };

  return (
    <nav className="w-full bg-white dark:bg-black/80 border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/farha-logo-only.svg" alt="FARHA Logo" className="w-9 h-9" />
          <div className="leading-tight">
            <span
              className="font-bold tracking-wide block text-[15px] text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              FARHA
            </span>
            <span className="font-medium tracking-[0.2em] uppercase block text-[10px] text-[#C9A84C]">
              Umrah Services
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/products" className={getLinkClass('/products')}>Katalog Modul</Link>
          <Link href="/packages" className={getLinkClass('/packages')}>Paket Umrah</Link>
          <Link href="/muthawif" className={getLinkClass('/muthawif')}>Direktori Muthawif</Link>
          <Link href="/blog" className={getLinkClass('/blog')}>Blog</Link>
          <Link href="/tentang" className={getLinkClass('/tentang')}>Tentang Kami</Link>
        </div>
        <div>
          <Button variant="outline" className="rounded-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
            Masuk
          </Button>
        </div>
      </div>
    </nav>
  );
}
