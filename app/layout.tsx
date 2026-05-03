import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RenderModeInit } from './components/providers/RenderModeInit';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Mon Espace - Comprendre le consentement',
  description: 'Application éducative sur le consentement pour les jeunes. Explore tes limites, comprends le consentement, et apprends à communiquer.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <RenderModeInit />
        {children}
      </body>
    </html>
  );
}
