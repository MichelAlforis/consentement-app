import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ouiclair.com'),
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
  alternates: {
    canonical: 'https://ouiclair.com',
  },
  openGraph: {
    title: 'OuiClair — Parle de sexe. Sans gêne. Sans honte.',
    description:
      "L'app qui t'apprend le consentement en jouant — gratuite, dès 13 ans, co-rédigée par un juriste en droit pénal.",
    url: 'https://ouiclair.com',
    siteName: 'OuiClair',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OuiClair — Apprends le consentement en jouant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OuiClair — Apprends le consentement en jouant',
    description: "Modules éducatifs, jeux interactifs, mode duo. Gratuit. Dès 13 ans.",
    images: ['/og-image.png'],
  },
  verification: {
    google: '7bYcJPhKTkWY21tfy73J6bYQEulocWIOW3gHQPCrRRQ',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0714',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://ouiclair.com/#organization',
      name: 'OuiClair',
      url: 'https://ouiclair.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ouiclair.com/logo.png',
      },
      description:
        "Application d'éducation au consentement sexuel co-rédigée par un juriste en droit pénal.",
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ouiclair.com/#website',
      url: 'https://ouiclair.com',
      name: 'OuiClair',
      publisher: { '@id': 'https://ouiclair.com/#organization' },
      inLanguage: 'fr-FR',
    },
    {
      '@type': 'MobileApplication',
      '@id': 'https://ouiclair.com/#app',
      name: 'OuiClair',
      description:
        "Apprends le consentement sexuel en jouant — modules progressifs, jeux interactifs, mode duo.",
      applicationCategory: 'EducationApplication',
      operatingSystem: ['iOS', 'Android'],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      author: { '@id': 'https://ouiclair.com/#organization' },
      inLanguage: ['fr', 'en', 'es'],
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        audienceType: 'Adolescents et jeunes adultes (13+)',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
