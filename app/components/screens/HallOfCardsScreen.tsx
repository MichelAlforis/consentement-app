'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUnlockStore } from '../../stores/unlockStore';
import { useRevealStore } from '../../stores/revealStore';
import { collectorCards, THEME_CATEGORIES } from '../../data/cards-collector';
import type { CollectorCard, CardTheme } from '../../data/cards-collector';
import type { GainedCard } from '../../lib/computeGainedCards';
import type { Screen } from '../../types';
import { useTranslation } from '../../i18n';
import { FlipRevealOverlay } from '../ui/FlipRevealOverlay';
import { CardFullscreenOverlay } from '../ui/CardFullscreenOverlay';
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
      className="relative rounded-2xl w-full aspect-[2/3]"
      style={{ perspective: '500px' }}
    >
      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden relative"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          background: card.gradient,
          boxShadow,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.20)_1.5px,transparent_1.5px)] bg-[length:12px_12px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_38%,rgba(0,0,0,0.40)_100%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] pointer-events-none">
          <DynamicIcon name={card.iconName} size={52} color="white" />
        </div>
        {card.rarity !== 'common' && (
          <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 flex gap-[3px] items-center">
            {card.rarity === 'unique'
              ? <span className="text-[8px] text-white/75 font-extrabold tracking-[0.12em]">✦ UNIQUE</span>
              : <span className="text-[8px] text-white/60 font-bold tracking-[0.10em]">RARE</span>
            }
          </div>
        )}
      </motion.div>
    </motion.button>
  );
}

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
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{ background: `linear-gradient(160deg, rgba(8,5,18,0.88), rgba(8,5,18,0.78)), ${categoryGradient}` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:11px_11px] rounded-[inherit]" />
      <Lock size={15} color={categoryBorder} className="opacity-50 relative z-[1]" />
      <p className="text-center px-2 leading-tight relative z-10 text-[7px] font-semibold text-[rgba(255,255,255,0.38)]">
        {card.unlockedBy.replace(/-/g, ' ')}
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

  const sharedCls = "w-full aspect-[2/3] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-1";
  const sharedBorderStyle = { border: `1.5px solid ${categoryBorder}28` };
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
        className={sharedCls}
        style={sharedBorderStyle}
        title={unlockLabel}
      >
        {inner}
      </motion.button>
    );
  }
  return <motion.div {...sharedMotion} className={sharedCls} style={sharedBorderStyle}>{inner}</motion.div>;
}

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
      <div className="flex items-center gap-[10px] mb-[10px]">
        <div
          className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0"
          style={{ background: cat.gradient, boxShadow: `0 3px 10px ${cat.border}55` }}
        >
          <DynamicIcon name={cat.iconName} size={18} color="white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-sm m-0" style={{ color: colors.textPrimary }}>
              {cat.name}
            </p>
            {allOwned
              ? <span className="text-[10px] font-bold text-[#10b981] bg-[rgba(16,185,129,0.12)] px-2 py-[2px] rounded-[20px]">✓ Complet</span>
              : <span className="text-[11px] font-semibold" style={{ color: colors.textMuted }}>
                  {ownedCount}<span className="opacity-50">/{total}</span>
                </span>
            }
          </div>
          <div
            className="mt-[5px] h-[3px] rounded-[2px] overflow-hidden"
            style={{ background: colors.border }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ delay: 0.3 + sectionIndex * 0.07, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              className="h-full rounded-[2px]"
              style={{ background: cat.gradient }}
            />
          </div>
        </div>
      </div>

      <div
        className="scrollbar-hide flex gap-[10px] overflow-x-auto snap-x snap-mandatory -ml-5 pl-5 pr-5 pb-1"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {cards.map((card, i) => (
          <div key={card.id} className="shrink-0 snap-start w-[120px]">
            {ownedIds.has(card.id)
              ? <CardBack card={toGainedCard(card)} index={i} onTap={onCardTap} />
              : <LockedCard
                  card={card}
                  index={i}
                  categoryGradient={cat.gradient}
                  categoryBorder={cat.border}
                  onTap={() => onNavigate(getUnlockScreen(card))}
                />
            }
          </div>
        ))}
      </div>
    </motion.div>
  );
}

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

  const primaryDeck = collectorCards.filter((c) => c.deck === (isAdult ? 'A' : 'M'));
  const deckB       = isAdult ? collectorCards.filter((c) => c.deck === 'B') : [];

  const allThemes = Object.keys(THEME_CATEGORIES) as CardTheme[];
  const primarySections = allThemes
    .map((theme) => ({ theme, cards: primaryDeck.filter((c) => c.theme === theme) }))
    .filter((s) => s.cards.length > 0);

  const deckBSections = allThemes
    .map((theme) => ({ theme, cards: deckB.filter((c) => c.theme === theme) }))
    .filter((s) => s.cards.length > 0);

  const totalOwned = primaryDeck.filter((c) => ownedIds.has(c.id)).length;
  const totalCards = primaryDeck.length;
  const globalPct  = totalCards > 0 ? totalOwned / totalCards : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col p-5"
      >
        <div className="mb-7">
          <h2 className="text-2xl font-black tracking-tight leading-none"
            style={{ color: colors.textPrimary }}>
            {t('hallOfCards.title')}
          </h2>

          <div className="flex items-center justify-between mt-[6px]">
            <p className="text-[13px]" style={{ color: colors.textMuted }}>
              {t('hallOfCards.subtitle', { owned: String(totalOwned), total: String(totalCards) })}
            </p>
            <p className="text-[13px] font-bold" style={{ color: colors.textMuted }}>
              {Math.round(globalPct * 100)} %
            </p>
          </div>
          <div
            className="mt-[6px] h-1 rounded-[2px] overflow-hidden"
            style={{ background: colors.border }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${globalPct * 100}%` }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              className="h-full rounded-[2px]"
              style={{ background: colors.premiumGradient }}
            />
          </div>
        </div>

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

      <AnimatePresence>
        {detail && <CardFullscreenOverlay card={detail} onClose={() => setDetail(null)} />}
      </AnimatePresence>

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
