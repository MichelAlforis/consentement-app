'use client';

import Link from 'next/link';
import Logo from './Logo';

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="border-t border-oui-border py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-oui-subtle text-sm leading-relaxed mt-4 max-w-xs">
              L&apos;application d&apos;éducation au consentement co-fondée par un juriste spécialisé
              en droit pénal. Gratuite, multilingue, dès 13 ans.
            </p>
          </div>

          <div>
            <FooterHeading>Application</FooterHeading>
            <FooterLinks links={[
              { label: 'Fonctionnalités', href: '#features' },
              { label: 'Pour les ados', href: '#audience' },
              { label: 'Pour les couples', href: '#audience' },
              { label: 'Télécharger', href: '#download' },
            ]} />
          </div>

          <div>
            <FooterHeading>Légal</FooterHeading>
            <FooterLinks links={[
              { label: 'Mentions légales', href: '/mentions-legales' },
              { label: 'Politique de confidentialité', href: '/confidentialite' },
              { label: 'CGU', href: '/cgu' },
              { label: 'Contact', href: 'mailto:contact@ouiclair.com' },
            ]} />
          </div>
        </div>

        <div className="pt-8 border-t border-oui-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-oui-subtle text-xs">
            © {CURRENT_YEAR} OuiClair. Tous droits réservés.
          </p>
          <p className="text-oui-subtle text-xs">
            Co-fondé par un juriste en droit pénal du consentement ·{' '}
            <span className="text-oui-muted">ouiclair.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}


function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-oui-text font-semibold text-sm mb-3">{children}</h4>;
}

function FooterLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          {l.href.startsWith('mailto:') ? (
            <a href={l.href} className="text-oui-subtle hover:text-oui-muted transition-colors text-sm">
              {l.label}
            </a>
          ) : (
            <Link href={l.href} className="text-oui-subtle hover:text-oui-muted transition-colors text-sm">
              {l.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
