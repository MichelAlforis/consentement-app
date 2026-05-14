import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — OuiClair',
  description: 'Politique de confidentialité et traitement des données personnelles — OuiClair.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ouiclair.com/confidentialite' },
};

export default function ConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-24 text-slate-200">
        <h1 className="text-3xl font-bold mb-10 text-white">Politique de confidentialité</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Responsable du traitement</h2>
          <p className="text-slate-300 leading-relaxed">
            Michel Marques — <a href="mailto:contact@ouiclair.com" className="underline text-violet-400">contact@ouiclair.com</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Données collectées</h2>
          <p className="text-slate-300 leading-relaxed mb-3">
            Dans le cadre de l'utilisation de l'application OuiClair, les données suivantes peuvent
            être collectées :
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
            <li>Identifiant anonyme de l'appareil (généré localement)</li>
            <li>Pseudonyme choisi lors de la création du profil</li>
            <li>Progression pédagogique (modules complétés, score)</li>
            <li>Préférences et réponses aux questionnaires (stockées localement)</li>
            <li>Données de session duo (échangées de manière chiffrée)</li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-3">
            <strong>Aucune donnée d'identification directe</strong> (nom, prénom, email, téléphone)
            n'est requise pour utiliser l'application.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Finalités et base légale</h2>
          <p className="text-slate-300 leading-relaxed">
            Les données sont traitées pour les finalités suivantes :
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2 mt-2">
            <li>Fourniture du service éducatif (base légale : exécution du contrat)</li>
            <li>Amélioration de l'expérience utilisateur (base légale : intérêt légitime)</li>
            <li>Synchronisation en mode duo (base légale : consentement de l'utilisateur)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Durée de conservation</h2>
          <p className="text-slate-300 leading-relaxed">
            Les données de progression sont conservées sur l'appareil de l'utilisateur tant que
            l'application est installée. Les données de session duo sont supprimées automatiquement
            72 heures après la fin de la session.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Vos droits (RGPD)</h2>
          <p className="text-slate-300 leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            des droits suivants : accès, rectification, effacement, portabilité, limitation du
            traitement et opposition. Pour exercer ces droits, contactez-nous à{' '}
            <a href="mailto:contact@ouiclair.com" className="underline text-violet-400">contact@ouiclair.com</a>.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            Vous avez également le droit d'introduire une réclamation auprès de la CNIL
            (<a href="https://www.cnil.fr" className="underline text-violet-400" target="_blank" rel="noopener">cnil.fr</a>).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Cookies</h2>
          <p className="text-slate-300 leading-relaxed">
            Le site ouiclair.com n'utilise pas de cookies de suivi ou publicitaires. Seuls des
            cookies techniques strictement nécessaires au bon fonctionnement du site peuvent être
            déposés.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-violet-400">Protection des mineurs</h2>
          <p className="text-slate-300 leading-relaxed">
            OuiClair est accessible dès 13 ans. Nous ne collectons pas sciemment de données
            personnelles d'enfants de moins de 13 ans. Si vous pensez qu'un mineur a fourni des
            données à caractère personnel, contactez-nous pour en demander la suppression.
          </p>
        </section>

        <p className="text-slate-500 text-sm mt-12">Dernière mise à jour : mai 2026</p>
      </main>
      <Footer />
    </>
  );
}
