'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-oui-bg/95 backdrop-blur-md border-b border-oui-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#pourquoi">Pourquoi OuiClair</NavLink>
          <NavLink href="#features">Fonctionnalités</NavLink>
          <NavLink href="#audience">Pour qui</NavLink>
        </div>

        {/* Desktop CTA */}
        <Link
          href="#download"
          className="hidden md:inline-flex px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-oui-violet to-oui-pink text-white hover:opacity-90 transition-opacity shadow-violet"
        >
          Télécharger
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-5 border-t border-oui-border/30 pt-4">
          <MobileNavLink href="#pourquoi" onClick={() => setOpen(false)}>Pourquoi OuiClair</MobileNavLink>
          <MobileNavLink href="#features" onClick={() => setOpen(false)}>Fonctionnalités</MobileNavLink>
          <MobileNavLink href="#audience" onClick={() => setOpen(false)}>Pour qui</MobileNavLink>
          <Link
            href="#download"
            onClick={() => setOpen(false)}
            className="mt-2 w-full text-center px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-oui-violet to-oui-pink text-white"
          >
            Télécharger
          </Link>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-oui-muted hover:text-white transition-colors text-sm font-medium">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-oui-muted hover:text-white transition-colors text-base font-medium">
      {children}
    </Link>
  );
}
