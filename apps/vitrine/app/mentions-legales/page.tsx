import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Mentions légales — OuiClair',
  description: "Mentions légales du site ouiclair.com et de l'application OuiClair.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ouiclair.com/mentions-legales' },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24 text-slate-200">
        <h1 className="text-3xl font-bold mb-10 text-white">Mentions légales</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Éditeur du site</h2>
          <p className="text-slate-300 leading-relaxed">
            Le site <strong>ouiclair.com</strong> et l'application <strong>OuiClair</strong> sont
            édités par :<br />
            <br />
            Michel Marques<br />
            Adresse : [À COMPLÉTER]<br />
            Contact : <a href="mailto:contact@ouiclair.com" className="underline text-violet-400">contact@ouiclair.com</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Hébergement</h2>
          <p className="text-slate-300 leading-relaxed">
            Le site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 1501,
            San Francisco, CA 94104, États-Unis — <a href="https://vercel.com" className="underline text-violet-400" target="_blank" rel="noopener">vercel.com</a>.<br />
            <br />
            Le backend applicatif est hébergé par <strong>Hetzner Online GmbH</strong>,
            Industriestr. 25, 91710 Gunzenhausen, Allemagne.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Propriété intellectuelle</h2>
          <p className="text-slate-300 leading-relaxed">
            L'ensemble des contenus présents sur ce site (textes, images, illustrations, marques,
            logotypes) est protégé par le droit de la propriété intellectuelle et appartient
            exclusivement à OuiClair, sauf mention contraire. Toute reproduction, représentation
            ou diffusion sans autorisation préalable est strictement interdite.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Responsabilité</h2>
          <p className="text-slate-300 leading-relaxed">
            OuiClair s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées
            sur ce site. Toutefois, OuiClair ne peut garantir l'exactitude, la précision ou
            l'exhaustivité des informations mises à disposition. OuiClair décline toute
            responsabilité pour toute imprécision, inexactitude ou omission portant sur des
            informations disponibles sur ce site.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Droit applicable</h2>
          <p className="text-slate-300 leading-relaxed">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les
            tribunaux français seront seuls compétents.
          </p>
        </section>

        <p className="text-slate-500 text-sm mt-12">Dernière mise à jour : mai 2026</p>
      </main>
      <Footer />
    </>
  );
}
