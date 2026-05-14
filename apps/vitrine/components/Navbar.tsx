'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-oui-bg/90 backdrop-blur-md border-b border-oui-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#pourquoi">Pourquoi OuiClair</NavLink>
          <NavLink href="#features">Fonctionnalités</NavLink>
          <NavLink href="#audience">Pour qui</NavLink>
        </div>
        <Link
          href="#download"
          className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-oui-violet to-oui-pink text-white hover:opacity-90 transition-opacity shadow-violet"
        >
          Télécharger
        </Link>
      </div>
    </nav>
  );
}


function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-oui-muted hover:text-oui-text transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}
