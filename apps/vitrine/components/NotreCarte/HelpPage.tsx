'use client';

import { useState } from 'react';
import AutoGrowTextarea from './AutoGrowTextarea';
import type { useNotreCarte } from './useNotreCarte';

type Nc = ReturnType<typeof useNotreCarte>;

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Pourquoi il n'y a que des besoins sur la carte ?",
    a: "Parce qu'un besoin répond à un autre besoin, qui répond à un autre. Ce qui se passe entre deux besoins n'est pas une case de plus : c'est le trajet. Il vit donc dans la flèche — touche-la, sa fiche contient « ce que ça rend possible » et « ce que ça peut donner ». Tant qu'un maillon manque, le suivant ne tient pas : ce n'est pas de la mauvaise volonté, c'est un circuit coupé.",
  },
  {
    q: 'Que veulent dire les deux barres d’un besoin ?',
    a: (
      <>
        <strong style={{ color: '#f8fafc' }}>Perçu</strong> : ce que reçoit vraiment la personne qui porte le besoin. <strong style={{ color: '#f8fafc' }}>Envoi</strong> : ce que l&apos;autre pense envoyer, à titre indicatif. Chacun ne règle que sa propre barre.
        <br />
        <br />
        Seule la perception compte : le besoin est validé par celui qui le porte, pas par l&apos;effort de l&apos;autre.
      </>
    ),
  },
  {
    q: "Et si je donne 100 % et que l'autre en perçoit 10 ?",
    a: "Alors l'effort est réel, mais le besoin a été mal compris. Ce n'est pas une question de quantité : ce qui est envoyé ne tombe pas là où ça compte. La question n'est pas « est-ce que j'en fais assez » mais « qu'est-ce qui compterait vraiment pour toi ».",
  },
  {
    q: 'Pourquoi certaines flèches sont plus épaisses ?',
    a: "L'épaisseur, c'est la perception — jamais l'effort déclaré. Plus une flèche est épaisse, plus l'autre peut recevoir. Quand elle s'éteint, la suite de la chaîne n'a plus de quoi passer : c'est exactement là que ça bloque.",
  },
  {
    q: 'Qui a le droit d’écrire quoi ?',
    a: (
      <>
        <p style={{ margin: 0 }}>Chaque champ appartient à celui dont il parle.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
          <span><strong style={{ color: '#f8fafc' }}>Toi seul</strong> — la formulation de tes besoins, ce que tu perçois, tes engagements, ta signature.</span>
          <span><strong style={{ color: '#f8fafc' }}>L&apos;autre seul</strong> — ce qu&apos;il pense t&apos;envoyer, et « ce que l&apos;autre en dit » sur tes besoins.</span>
          <span><strong style={{ color: '#f8fafc' }}>Le porteur du besoin de départ</strong> — le contenu d&apos;une flèche : c&apos;est lui qui sait ce que ça lui ouvre et ce qu&apos;il peut alors donner. On ne tire donc une flèche que depuis un de ses propres besoins.</span>
          <span><strong style={{ color: '#f8fafc' }}>À deux</strong> — le travail perso, les signaux d&apos;alerte, les non-négociables, le préambule, et la carte elle-même.</span>
        </div>
      </>
    ),
  },
  {
    q: 'À quoi sert « ce que l’autre en dit » ?',
    a: 'À laisser une parole qui ne se réécrit pas. Sur chaque besoin, celui qui ne le porte pas peut écrire son ressenti une seule fois : une fois validé, le texte se fige, signé et daté. Personne ne peut l’adoucir ensuite.',
  },
  {
    q: 'Comment on ajoute, relie, déplace ?',
    a: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <span><strong style={{ color: '#f8fafc' }}>Ouvrir</strong> — touche un besoin sur la carte, ou la pastille au milieu d&apos;une flèche. Chaque fiche a son adresse : tu peux l&apos;envoyer ou la mettre en favori.</span>
        <span><strong style={{ color: '#f8fafc' }}>Ajouter</strong> — « + Besoin » pose un besoin au centre de la carte.</span>
        <span><strong style={{ color: '#f8fafc' }}>Relier</strong> — « Tirer une flèche », puis le départ, puis l&apos;arrivée. Seuls tes besoins s&apos;allument : le départ doit être à toi.</span>
        <span><strong style={{ color: '#f8fafc' }}>Déplacer</strong> — attrape un besoin et fais-le glisser du doigt. La position est gardée.</span>
        <span><strong style={{ color: '#f8fafc' }}>Supprimer</strong> — depuis la fiche, ou le × rose au bout de chaque ligne.</span>
      </div>
    ),
  },
  {
    q: 'Signaux d’alerte, non-négociables, travail seul : quelle différence ?',
    a: (
      <>
        <p style={{ margin: 0 }}><strong style={{ color: '#f8fafc' }}>Les signaux d&apos;alerte</strong> sont des faits observables. Quand l&apos;un arrive, la boucle est déjà cassée : on relit la carte.</p>
        <p style={{ margin: '10px 0 0' }}><strong style={{ color: '#f8fafc' }}>Les non-négociables</strong> ne sont pas des préférences. C&apos;est la limite en-dessous de laquelle la carte ne sert plus à rien.</p>
        <p style={{ margin: '10px 0 0' }}><strong style={{ color: '#f8fafc' }}>Le travail seul</strong>, sur la page de chacun, est ce qui ne se règle pas en réunion de couple. À relire avec son thérapeute, pas à se jeter à la figure.</p>
      </>
    ),
  },
  {
    q: 'Où sont stockées les données ?',
    a: (
      <>
        <p style={{ margin: 0 }}>Sur un serveur privé, chez vous — pas dans le cloud d&apos;un tiers, pas dans ce dépôt de code. La carte se synchronise entre vos deux appareils pendant que vous êtes sur le wifi de la maison.</p>
        <p style={{ margin: '10px 0 0' }}>Le prénom demandé à l&apos;ouverture sert à s&apos;identifier et à signer les modifications : chaque écriture est datée et attribuée.</p>
      </>
    ),
  },
];

export default function HelpPage({ nc }: { nc: Nc }) {
  const { state } = nc;
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14, animation: 'nc-enter .3s cubic-bezier(.2,1.1,.4,1) both' }}>
      <button type="button" onClick={nc.goMap} className="nc-hover-left" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', color: '#94a3b8', borderRadius: 9999, padding: '11px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        ← La carte
      </button>
      <div>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#8b5cf6' }}>Mode d&apos;emploi</span>
        <h1 className="nc-fiche-h1" style={{ margin: '6px 0 0', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.1 }}>Les questions qu&apos;on se pose.</h1>
      </div>

      <div style={{ padding: 18, borderRadius: 16, background: 'rgba(139,92,246,.07)', border: '1px solid rgba(139,92,246,.22)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#a78bfa' }}>Pourquoi ce document existe</span>
        <AutoGrowTextarea
          rows={5}
          value={state.preambule}
          onChange={(v) => nc.set({ preambule: v })}
          style={{ width: '100%', marginTop: 10, background: 'rgba(13,7,20,.5)', border: '1px solid rgba(139,92,246,.22)', borderRadius: 12, padding: 12, color: '#ddd6fe', fontSize: 16, lineHeight: 1.65 }}
        />
        <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 7 }}>Ce texte est à vous : réécrivez-le quand il ne dit plus vrai.</span>
      </div>

      {FAQ.map((item, i) => (
        <details key={i} style={{ border: '1px solid #2e1f46', borderRadius: 14, padding: '14px 16px', background: 'rgba(26,17,40,.5)' }}>
          <summary className="nc-summary" style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
            <span className="nc-chev" style={{ color: '#8b5cf6', fontSize: 11 }}>▶</span>
            <span style={{ flex: 1 }}>{item.q}</span>
          </summary>
          <div style={{ margin: '10px 0 0', fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{item.a}</div>
        </details>
      ))}

      <div style={{ padding: 18, borderRadius: 16, background: 'rgba(236,72,153,.05)', border: '1px solid rgba(236,72,153,.22)' }}>
        <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#f472b6' }}>Repartir de zéro</span>
        <p style={{ margin: '10px 0 14px', fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>Remet la carte d&apos;origine : les cinq besoins, leurs liens et tous les textes de départ. Ce que vous avez écrit depuis est perdu.</p>
        {confirming ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => { nc.resetToSeed(); setConfirming(false); }} style={{ flex: 1, background: 'rgba(236,72,153,.2)', border: '1px solid rgba(236,72,153,.5)', borderRadius: 11, color: '#f472b6', padding: '12px 16px', fontSize: 12, cursor: 'pointer' }}>
              Confirmer
            </button>
            <button type="button" onClick={() => setConfirming(false)} style={{ flex: 1, background: 'none', border: '1px solid #2e1f46', borderRadius: 11, color: '#94a3b8', padding: '12px 16px', fontSize: 12, cursor: 'pointer' }}>
              Annuler
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="nc-hover-scale" style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', color: '#f472b6', borderRadius: 11, padding: '12px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Repartir de la carte d&apos;origine
          </button>
        )}
      </div>
    </div>
  );
}
