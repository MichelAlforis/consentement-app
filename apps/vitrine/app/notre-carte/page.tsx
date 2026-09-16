import type { Metadata, Viewport } from 'next';
import NotreCarteLoader from '@/components/NotreCarte/NotreCarteLoader';

export const metadata: Metadata = {
  title: 'Notre carte',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0d0714',
};

export default function NotreCartePage() {
  return <NotreCarteLoader />;
}
