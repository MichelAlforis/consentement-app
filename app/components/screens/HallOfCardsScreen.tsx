'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Lock, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUnlockStore } from '../../stores/unlockStore';
import { useRevealStore } from '../../stores/revealStore';
import { collectorCards, THEME_CATEGORIES } from '../../data/cards-collector';
import type { CollectorCard, CardTheme } from '../../data/cards-collector';
import type { GainedCard } from '../../lib/computeGainedCards';
import type { Screen } from '../../types';
import { useTranslation } from '../../i18n';
import { FlipRevealOverlay } from '../ui/FlipRevealOverlay';
import { CollectorCardFace } from '../ui/CollectorCardFace';
import { DynamicIcon } from '../../utils/iconFromName';
import { useNormalizedPointer } from './CardGame/hooks/useNormalizedPointer';

function toGainedCard(card: CollectorCard): GainedCard {
  return {
    id: card.id,
    text: card.text,
    theme: card.theme,
    themeName: THEME_CATEGORIES[card.theme].name,
    rarity: card.rarity,
    gradient: card.visual.gradient,
    iconName: card.visual.iconName,
    border: card.visual.border,
  };
}

function getUnlockScreen(card: CollectorCard): Screen {
  return card.depth === 3 ? 'jeu-oie' : 'jeu-cartes';
}

// ── Dos de carte (cartes possédées) ──────────────────────────────────────────
// Affiche le dos avec le gradient de la catégorie — la face est révélée dans
// CardDetailSheet (ou plus tard dans le fullscreen R3F, chantier #3).

function CardBack({ card, index, onTap }: {
  card: GainedCard;
  index: number;
  onTap: (c: GainedCard) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { x, y } = useNormalizedPointer(ref);
  const tiltX = useSpring(useTransform(y, [-1, 1], [5, -5]), { stiffness: 400, damping: 30 });
  const tiltY = useSpring(useTransform(x, [-1, 1], [-5, 5]), { stiffness: 400, damping: 30 });

  const boxShadow =
    card.rarity === 'unique'
      ? `0 0 0 2px ${card.border}, 0 6px 20px ${card.border}88`
      : card.rarity === 'rare'
        ? `0 0 0 1.5px ${card.border}aa, 0 4px 16px ${card.border}55`
        : `0 3px 12px ${card.border}44`;

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileTap={{ scale: 0.93 }}
      onClick={() => onTap(card)}
      style={{ aspectRatio: '2 / 3', perspective: '500px' }}
      className="relative rounded-2xl"
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX: tiltX,
          rotateY: tiltY,
          borderRadius: 16,
          overflow: 'hidden',
          background: card.gradient,
          boxShadow,
          position: 'relative',
        }}
      >
        {/* Texture points */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.20) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 35%, transparent 38%, rgba(0,0,0,0.40) 100%)',
        }} />
        {/* Icône catégorie en filigrane */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.12, pointerEvents: 'none',
        }}>
          <DynamicIcon name={card.iconName} size={52} color="white" />
        </div>
        {/* Indicateur rareté en bas */}
        {card.rarity !== 'common' && (
          <div style={{
            position: 'absolute', bottom: 7, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 3, alignItems: 'center',
          }}>
            {card.rarity === 'unique'
              ? <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.75)', fontWeight: 800, letterSpacing: '0.12em' }}>✦ UNIQUE</span>
              : <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.60)', fontWeight: 700, letterSpacing: '0.10em' }}>RARE</span>
            }
          </div>
        )}
      </motion.div>
    </motion.button>
  );
}

// ── Carte verrouillée (hint catégorie pour l'effet FOMO) ─────────────────────

function LockedCard({ card, index, categoryGradient, categoryBorder, onTap }: {
  card: CollectorCard;
  index: number;
  categoryGradient: string;
  categoryBorder: string;
  onTap?: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const inner = (
    <>
      {/* Gradient catégorie très sombre — on devine la couleur sans la révéler */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, rgba(8,5,18,0.88), rgba(8,5,18,0.78)), ${categoryGradient}`,
        borderRadius: 'inherit',
      }} />
      {/* Texture points atténuée */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '11px 11px',
        borderRadius: 'inherit',
      }} />
      <Lock size={15} color={categoryBorder} style={{ opacity: 0.50, position: 'relative', zIndex: 1 }} />
      <p className="text-center px-2 leading-tight relative z-10"
        style={{ fontSize: 7, fontWeight: 600, color: 'rgba(255,255,255,0.38)' }}>
        {card.unlockedBy.replace(/-/g, ' ')}
      </p>
      <div className="absolute bottom-2 flex gap-0.5">
        {([1, 2, 3] as const).map((d) => (
          <div key={d} className="w-1.5 h-1.5 rounded-full" style={{
            background: d <= card.depth ? categoryBorder : colors.border,
            opacity: d <= card.depth ? 0.35 : 0.12,
          }} />
        ))}
      </div>
    </>
  );

  const sharedStyle = {
    aspectRatio: '2 / 3' as const,
    borderRadius: 16,
    border: `1.5px solid ${categoryBorder}28`,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  };
  const sharedMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.03 },
  };

  if (onTap) {
    const unlockLabel = t ? t('hallOfCards.appAdulte') : 'Déverrouiller';
    return (
      <motion.button
        {...sharedMotion}
        whileTap={{ scale: 0.93 }}
        onClick={onTap}
        style={sharedStyle}
        title={unlockLabel}
      >
        {inner}
      </motion.button>
    );
  }
  return <motion.div {...sharedMotion} style={sharedStyle}>{inner}</motion.div>;
}

// ── Fiche détail carte (remplace ZoomOverlay R3F — sera upgrader en fullscreen R3F chantier #3) ──

function CardDetailSheet({ card, onClose }: { card: GainedCard; onClose: () => void }) {
  const { t } = useTranslation();

  const rarityLabel =
    card.rarity === 'unique' ? t('hallOfCards.rarityUnique')
    : card.rarity === 'rare'   ? t('hallOfCards.rarityRare')
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0e0b1a',
          borderRadius: '22px 22px 0 0',
          paddingBottom: 40,
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
        </div>

        {/* Contenu */}
        <div style={{ padding: '8px 24px 0' }}>
          {/* Carte face + méta côte à côte */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 108, height: 162, flexShrink: 0, borderRadius: 14, overflow: 'hidden' }}>
              <CollectorCardFace card={card} rarityLabel={rarityLabel} size="compact"
                style={{ width: '100%', height: '100%' }} />
            </div>

            <div style={{ flex: 1, paddingTop: 2 }}>
              {/* Badge thème */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20,
                background: card.gradient, marginBottom: 10,
              }}>
                <DynamicIcon name={card.iconName} size={11} color="white" />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white', letterSpacing: '0.05em' }}>
                  {card.themeName ?? card.theme}
                </span>
              </div>

              {/* Texte de la carte */}
              <p style={{
                color: 'rgba(255,255,255,0.88)',
                fontSize: 13,
                lineHeight: 1.65,
                margin: 0,
              }}>
                {card.text}
              </p>

              {/* Rareté */}
              {rarityLabel && (
                <p style={{
                  marginTop: 10, fontSize: 10, fontWeight: 700,
                  color: card.border, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  ✦ {rarityLabel}
                </p>
              )}
            </div>
          </div>

          {/* Bouton fermer */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              marginTop: 22, width: '100%',
              padding: '13px 0', borderRadius: 14,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <ChevronDown size={16} />
            Fermer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Section par thème ────────────────────────────────────────────────────────

function ThemeSection({
  theme, cards, ownedIds, sectionIndex, onCardTap, onNavigate,
}: {
  theme: CardTheme;
  cards: CollectorCard[];
  ownedIds: Set<string>;
  sectionIndex: number;
  onCardTap: (card: GainedCard) => void;
  onNavigate: (screen: Screen) => void;
}) {
  const { colors } = useTheme();
  const cat = THEME_CATEGORIES[theme];
  const ownedCount = cards.filter((c) => ownedIds.has(c.id)).length;
  const total = cards.length;
  const pct = total > 0 ? ownedCount / total : 0;
  const allOwned = ownedCount === total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + sectionIndex * 0.07, ease: [0.22, 0.61, 0.36, 1] }}
      className="mb-8"
    >
      {/* En-tête section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: cat.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 3px 10px ${cat.border}55`,
        }}>
          <DynamicIcon name={cat.iconName} size={18} color="white" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: colors.textPrimary, margin: 0 }}>
              {cat.name}
            </p>
            {allOwned
              ? <span style={{
                  fontSize: 10, fontWeight: 700, color: '#10b981',
                  background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 20,
                }}>✓ Complet</span>
              : <span style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600 }}>
                  {ownedCount}<span style={{ opacity: 0.5 }}>/{total}</span>
                </span>
            }
          </div>
          {/* Barre de progression */}
          <div style={{
            marginTop: 5, height: 3, borderRadius: 2,
            background: colors.border, overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ delay: 0.3 + sectionIndex * 0.07, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 2, background: cat.gradient }}
            />
          </div>
        </div>
      </div>

      {/* Grille cartes */}
      <div className="grid grid-cols-3 gap-2.5">
        {cards.map((card, i) =>
          ownedIds.has(card.id)
            ? <CardBack
                key={card.id}
                card={toGainedCard(card)}
                index={i}
                onTap={onCardTap}
              />
            : <LockedCard
                key={card.id}
                card={card}
                index={i}
                categoryGradient={cat.gradient}
                categoryBorder={cat.border}
                onTap={() => onNavigate(getUnlockScreen(card))}
              />
        )}
      </div>
    </motion.div>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────

interface HallOfCardsScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate: (screen: Screen) => void;
}

export function HallOfCardsScreen({ isAdult, onNavigate }: HallOfCardsScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { ownedCards } = useUnlockStore();
  const ownedIds = new Set(ownedCards.map((c) => c.id));
  const [detail, setDetail] = useState<GainedCard | null>(null);

  const { pendingIds, clearPending } = useRevealStore();
  const revealCards = pendingIds
    .map((id) => collectorCards.find((c) => c.id === id))
    .filter((c): c is CollectorCard => c !== undefined)
    .map(toGainedCard);
  const [showReveal, setShowReveal] = useState(revealCards.length > 0);

  useEffect(() => {
    if (pendingIds.length > 0) setShowReveal(true);
  }, [pendingIds]);

  // Deck principal selon profil
  const primaryDeck = collectorCards.filter((c) => c.deck === (isAdult ? 'A' : 'M'));
  const deckB       = isAdult ? collectorCards.filter((c) => c.deck === 'B') : [];

  // Classement automatique par thème
  const allThemes = Object.keys(THEME_CATEGORIES) as CardTheme[];
  const primarySections = allThemes
    .map((theme) => ({ theme, cards: primaryDeck.filter((c) => c.theme === theme) }))
    .filter((s) => s.cards.length > 0);

  const deckBSections = allThemes
    .map((theme) => ({ theme, cards: deckB.filter((c) => c.theme === theme) }))
    .filter((s) => s.cards.length > 0);

  // Progression globale
  const totalOwned = primaryDeck.filter((c) => ownedIds.has(c.id)).length;
  const totalCards = primaryDeck.length;
  const globalPct  = totalCards > 0 ? totalOwned / totalCards : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col px-5 pt-5 pb-5"
      >
        {/* Header */}
        <div className="mb-7">
          <h2 className="text-2xl font-black tracking-tight leading-none"
            style={{ color: colors.textPrimary }}>
            {t('hallOfCards.title')}
          </h2>

          {/* Compteur + barre progression globale */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <p style={{ fontSize: 13, color: colors.textMuted }}>
              {t('hallOfCards.subtitle', { owned: String(totalOwned), total: String(totalCards) })}
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: colors.textMuted }}>
              {Math.round(globalPct * 100)} %
            </p>
          </div>
          <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: colors.border, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${globalPct * 100}%` }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 2, background: colors.premiumGradient }}
            />
          </div>
        </div>

        {/* Sections thème — deck principal */}
        {primarySections.map((s, i) => (
          <ThemeSection
            key={s.theme}
            theme={s.theme}
            cards={s.cards}
            ownedIds={ownedIds}
            sectionIndex={i}
            onCardTap={setDetail}
            onNavigate={onNavigate}
          />
        ))}

        {/* Deck B — adultes seulement */}
        {deckBSections.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 mt-2"
              style={{ color: colors.textMuted }}>
              {t('hallOfCards.deckBLabel')}
            </p>
            {deckBSections.map((s, i) => (
              <ThemeSection
                key={`b-${s.theme}`}
                theme={s.theme}
                cards={s.cards}
                ownedIds={ownedIds}
                sectionIndex={primarySections.length + i}
                onCardTap={setDetail}
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Fiche détail — CSS pur, sera remplacée par fullscreen R3F (chantier #3) */}
      <AnimatePresence>
        {detail && <CardDetailSheet card={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>

      {/* Flip reveal — nouvelles cartes débloquées */}
      <AnimatePresence>
        {showReveal && revealCards.length > 0 && (
          <FlipRevealOverlay
            cards={revealCards}
            onDone={() => { clearPending(); setShowReveal(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
