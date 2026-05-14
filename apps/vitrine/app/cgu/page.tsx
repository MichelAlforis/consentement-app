import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — OuiClair",
  description: "Conditions générales d'utilisation de l'application OuiClair.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ouiclair.com/cgu' },
};

export default function CguPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24 text-slate-200">
        <h1 className="text-3xl font-bold mb-10 text-white">
          Conditions Générales d'Utilisation
        </h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">1. Objet</h2>
          <p className="text-slate-300 leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
            de l'application mobile <strong>OuiClair</strong> et du site <strong>ouiclair.com</strong>,
            édités par Michel Marques. En utilisant l'application, l'utilisateur accepte sans réserve
            les présentes CGU.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">2. Accès au service</h2>
          <p className="text-slate-300 leading-relaxed">
            OuiClair est accessible gratuitement à toute personne âgée de 13 ans ou plus. L'accès
            à certains contenus explicites peut être soumis à une confirmation d'âge supplémentaire.
            L'éditeur se réserve le droit de modifier, suspendre ou interrompre l'accès au service
            à tout moment, sans préavis.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">3. Utilisation du service</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            L'utilisateur s'engage à utiliser OuiClair dans le respect des lois en vigueur et des
            présentes CGU. Il est notamment interdit de :
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
            <li>Tenter de contourner les mécanismes de sécurité de l'application</li>
            <li>Utiliser le service à des fins illicites ou contraires à l'ordre public</li>
            <li>Reproduire, distribuer ou exploiter commercialement les contenus sans autorisation</li>
            <li>Partager ses identifiants de connexion avec des tiers</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">4. Propriété intellectuelle</h2>
          <p className="text-slate-300 leading-relaxed">
            L'ensemble des contenus de l'application (textes, illustrations, modules pédagogiques,
            jeux, code source) est protégé par le droit de la propriété intellectuelle et demeure
            la propriété exclusive d'OuiClair. Toute reproduction totale ou partielle est interdite
            sans autorisation écrite préalable.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">5. Contenu éducatif</h2>
          <p className="text-slate-300 leading-relaxed">
            Les contenus d'OuiClair ont une vocation exclusivement éducative et informative. Ils
            ne constituent pas un avis juridique, médical ou psychologique. OuiClair ne saurait être
            tenu responsable des décisions prises par l'utilisateur sur la base des informations
            fournies.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">6. Responsabilité</h2>
          <p className="text-slate-300 leading-relaxed">
            OuiClair est fourni « en l'état ». L'éditeur ne garantit pas que le service sera
            exempt d'interruptions ou d'erreurs. La responsabilité d'OuiClair ne saurait être
            engagée pour tout dommage direct ou indirect résultant de l'utilisation ou de
            l'impossibilité d'utiliser le service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">7. Modifications des CGU</h2>
          <p className="text-slate-300 leading-relaxed">
            OuiClair se réserve le droit de modifier les présentes CGU à tout moment. Les
            utilisateurs seront informés des modifications via l'application. La poursuite de
            l'utilisation du service vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">8. Droit applicable</h2>
          <p className="text-slate-300 leading-relaxed">
            Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de
            résolution amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">9. Contact</h2>
          <p className="text-slate-300 leading-relaxed">
            Pour toute question relative aux présentes CGU :{' '}
            <a href="mailto:contact@ouiclair.com" className="underline text-violet-400">
              contact@ouiclair.com
            </a>
          </p>
        </section>

        <p className="text-slate-500 text-sm mt-12">Dernière mise à jour : mai 2026</p>
      </main>
      <Footer />
    </>
  );
}
