import type { Metadata } from 'next';
import NeedsMapLoader from '@/components/NeedsMap/NeedsMapLoader';

export const metadata: Metadata = {
  title: 'Notre carte des besoins',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function NotreCartePage() {
  return <NeedsMapLoader />;
}
