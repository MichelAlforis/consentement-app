import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhySection from '@/components/WhySection';
import Features from '@/components/Features';
import AudienceSection from '@/components/AudienceSection';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-oui-bg">
      <Navbar />
      <Hero />
      <WhySection />
      <Features />
      <AudienceSection />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
