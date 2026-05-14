import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OuiClair — Apprends le consentement en jouant',
  description:
    "OuiClair est l'app d'éducation au consentement sexuel co-rédigée par un juriste. Modules progressifs, jeux interactifs, mode duo. Gratuit, dès 13 ans. iOS & Android.",
  keywords: [
    'consentement sexuel',
    'éducation sexuelle',
    'app adolescents',
    'consentement app',
    'jeux éducatifs',
    'droit pénal consentement',
    'OuiClair',
  ],
  authors: [{ name: 'OuiClair' }],
  openGraph: {
    title: 'OuiClair — Parle de sexe. Sans gêne. Sans honte.',
    description:
      "L'app qui t'apprend le consentement en jouant — gratuite, dès 13 ans, co-rédigée par un juriste en droit pénal.",
    url: 'https://ouiclair.com',
    siteName: 'OuiClair',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OuiClair — Apprends le consentement en jouant',
    description: "Modules éducatifs, jeux interactifs, mode duo. Gratuit. Dès 13 ans.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0714',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
