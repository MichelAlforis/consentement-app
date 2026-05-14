'use client';

import { useState, useEffect, useCallback } from 'react';
import { useHaptics } from '../../../game-engine/shared/useHaptics';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, RotateCcw, Shuffle, ChevronRight, Sparkles, Heart, Trophy } from 'lucide-react';
import { CardTheme, THEME_CATEGORIES } from '../../../data/cards-collector';
import { DynamicIcon } from '../../../utils/iconFromName';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from '../../../i18n';
import { useCardSession } from './hooks/useCardSession';
import { PlayingCard } from './PlayingCard';
import { GameEndCinematic } from '../../../game-engine/shared/GameEndCinematic';
import { CollectorCardCanvas } from '../../../game-engine/cards/CollectorCardCanvas';
import { computeGainedCards } from '../../../lib/computeGainedCards';
import type { GainedCard } from '../../../lib/computeGainedCards';
import { collectorCards, getCollectorCardById } from '../../../data/cards-collector';
import { useUnlockStore } from '../../../stores/unlockStore';
import type { Screen } from '../../../types';

export type { GainedCard };

// Affiche les cartes gagnées séquentiellement avec flip R3F
function CardUnlockReveal({ cards }: { cards: GainedCard[] }) {
  const [mountedCount, setMountedCount] = useState(0);
  const [flipped, setFlipped]           = useState<Record<string, boolean>>({});
  const [hintVisible, setHintVisible]   = useState(false);
  const { vibrate } = useHaptics();
  const { t } = useTranslation();

  // 1 carte → 160px | 2 → 150px | 3+ → 140px (scroll horizontal)
  const cardSize   = cards.length === 1 ? 160 : cards.length === 2 ? 150 : 140;
  const isScrollable = cards.length >= 3;

  useEffect(() => {
    if (cards.length === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    cards.forEach((card, i) => {
      timers.push(setTimeout(() => setMountedCount(n => Math.max(n, i + 1)), 300 + i * 550));
      timers.push(setTimeout(() => setFlipped(f => ({ ...f, [card.id]: true })), 300 + i * 550 + 800));
    });

    // Hint juste après le premier flip — l'utilisateur sait déjà que les cartes sont interactives
    timers.push(setTimeout(() => setHintVisible(true), 300 + 800 + 300));

    return () => timers.forEach(clearTimeout);
  }, [cards]);

  if (cards.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full mb-6"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] mb-5 text-center text-white/40">
        {cards.length > 1 ? t('flipReveal.cardsUnlockedLabel', { count: cards.length }) : t('flipReveal.cardUnlockedLabel')}
      </p>

      {/* 3+ cartes : scroll horizontal avec snap — 2 cartes visibles, bord du 3e visible */}
      <div
        className={isScrollable
          ? 'flex overflow-x-auto gap-3 snap-x snap-mandatory pb-2 -mx-5 px-5'
          : 'flex gap-4 justify-center'}
        style={isScrollable ? { scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } : undefined}
      >
        {cards.slice(0, mountedCount).map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.72, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileTap={{ scale: 0.94, transition: { duration: 0.1 } }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={() => {
              vibrate('light');
              setFlipped(f => ({ ...f, [card.id]: !f[card.id] }));
            }}
            className={`cursor-pointer${isScrollable ? ' snap-center flex-shrink-0' : ''}`}
            style={{ width: cardSize, height: Math.round(cardSize * 1.5) }}
          >
            <CollectorCardCanvas
              card={card}
              isFlipped={!!flipped[card.id]}
              size={cardSize}
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: hintVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-4 text-xs text-white/50"
      >
        {isScrollable ? t('flipReveal.hintScroll') : t('flipReveal.hintTap')}
      </motion.p>
    </motion.div>
  );
}

interface CardGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate?: (screen: Screen) => void;
}

export function CardGameScreen({ isPremium, isAdult, onNavigate }: CardGameScreenProps) {
  const { colors, id: themeId } = useTheme();
  const { t } = useTranslation();
  const s = useCardSession(isAdult);

  const { ownedCards, sessionCount, unlockCards, incrementSessionCount, drawFromPool } = useUnlockStore();
  const [gainedCards, setGainedCards] = useState<GainedCard[]>([]);

  const handleGoToEnd = useCallback(() => {
    const ownedIds = new Set(ownedCards.map((c) => c.id));
    const nextSessionCount = sessionCount + 1;
    incrementSessionCount();

    const { gained, ownedCards: newOwned } = computeGainedCards({
      sessionMode: s.sessionMode,
      cardCount: s.cardCount,
      seanceSize: s.seanceSize,
      sessionThemes: s.sessionThemes,
      sessionCount: nextSessionCount,
      ownedIds,
      favorites: s.favorites,
      isPremium,
    }, collectorCards);

    if (newOwned.length > 0) unlockCards(newOwned);

    // Tirage pool lexique : ajoute une carte gagnée via unlock de terme
    const drawn = drawFromPool();
    if (drawn) {
      const card = getCollectorCardById(drawn.id);
      if (card) {
        gained.push({
          id: card.id, text: card.text, theme: card.theme,
          rarity: card.rarity, gradient: card.visual.gradient,
          iconName: card.visual.iconName, border: card.visual.border,
        });
      }
    }

    setGainedCards(gained);
    s.goToEnd();
  }, [ownedCards, sessionCount, incrementSessionCount, s, unlockCards, isPremium, drawFromPool]);

  const deckRemaining = s.sessionMode === 'seance'
    ? Math.max(0, s.seanceSize - s.cardCount)
    : s.isSeanceDone ? 0 : 3;

  const deepThemes: CardTheme[] = ['verite', 'douceur'];
  const midThemes: CardTheme[] = ['parlez', 'et-si'];
  const endInsight = s.sessionThemes.some((th) => deepThemes.includes(th))
    ? t('cardGame.insight1')
    : s.sessionThemes.some((th) => midThemes.includes(th))
      ? t('cardGame.insight2')
      : t('cardGame.insight3');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
      <AnimatePresence mode="wait">

        {/* ── PICK ─────────────────────────────────────────── */}
        {s.step === 'pick' && (
          <motion.div key="pick"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="flex flex-col px-5 pt-5 pb-5"
          >
            {/* ── EMPTY DECK GUARD ────────────────────────── */}
            {s.available.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center px-2 pt-8 pb-10 gap-6"
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
                  style={{ background: colors.premiumGradient }}
                >
                  <Sparkles size={36} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2" style={{ color: colors.textPrimary }}>
                    {t('cardGame.emptyTitle')}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                    {t('cardGame.emptyDesc')}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate?.('quiz-consentement')}
                  className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                  style={{ background: colors.premiumGradient, boxShadow: `0 6px 24px ${colors.premiumShadow}` }}
                >
                  <ChevronRight size={18} />
                  {t('cardGame.emptyCTA')}
                </motion.button>
              </motion.div>
            )}

            {s.available.length > 0 && (<><div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none" style={{ color: colors.textPrimary }}>{t('cardGame.title')}</h2>
                <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                  {s.available.length} {t('cardGame.cardUnit')}
                  {s.favorites.length > 0 && (
                    <span className="ml-2 text-rose-400 inline-flex items-center gap-1">· <Heart size={12} className="inline" /> {s.favorites.length} {s.favorites.length > 1 ? t('cardGame.favUnitPlural') : t('cardGame.favUnit')}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm shrink-0"
                style={{ background: colors.premiumGradient }}>
                <Sparkles size={11} className="text-white" />
                <span className="text-xs font-bold text-white tracking-widest">{t('games.premium')}</span>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>{t('cardGame.settings')}</p>
            <div className="rounded-2xl p-3 mb-6 space-y-2.5" style={{ background: colors.bgSecondary }}>
              <div className="grid grid-cols-2 gap-2">
                {([
                  [true, <User size={14} key="u" />, t('diceGame.solo.title')],
                  [false, <Users size={14} key="us" />, t('diceGame.duo.title')],
                ] as [boolean, React.ReactNode, string][]).map(([solo, icon, label]) => {
                  const active = s.isSolo === solo;
                  return (
                    <motion.button key={label} whileTap={{ scale: 0.96 }}
                      onClick={() => s.setIsSolo(solo)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all"
                      style={active
                        ? { borderColor: colors.premium, background: colors.premiumLight, color: colors.premium }
                        : { borderColor: 'transparent', background: colors.bgCard, color: colors.textMuted }}
                    >
                      {icon}{label}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex rounded-xl p-0.5 gap-0.5" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
                {([['seance', t('cardGame.seanceMode')], ['libre', t('cardGame.libreMode')]] as const).map(([mode, label]) => (
                  <button key={mode} onClick={() => s.setSessionMode(mode)}
                    className="flex-1 py-2 rounded-[10px] text-xs font-bold transition-all"
                    style={s.sessionMode === mode
                      ? { background: colors.premiumGradient, color: '#fff' }
                      : { color: colors.textMuted }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {s.sessionMode === 'seance' && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2">
                  {([5, 10] as const).map((n) => (
                    <button key={n} onClick={() => s.setSeanceSize(n)}
                      className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
                      style={s.seanceSize === n
                        ? { borderColor: colors.premium, background: colors.premiumLight, color: colors.premium }
                        : { borderColor: colors.border, color: colors.textMuted }}
                    >
                      {n} {t('cardGame.cardUnit')}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>{t('cardGame.deckLabel')}</p>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => s.setSelectedTheme('random')}
              className="w-full mb-3 p-4 rounded-2xl border-2 flex items-center gap-4 transition-all"
              style={s.selectedTheme === 'random'
                ? { borderColor: colors.premium, background: colors.premiumLight }
                : { borderColor: colors.border, background: colors.bgSecondary }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_35%,#ec4899_70%,#f59e0b_100%)]">
                <Shuffle size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: s.selectedTheme === 'random' ? colors.premium : colors.textPrimary }}>{t('cardGame.random')}</p>
                <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{t('cardGame.randomDesc', { count: s.available.length })}</p>
              </div>
              {s.selectedTheme === 'random' && (
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              )}
            </motion.button>

            <div className="grid grid-cols-3 gap-2.5 mb-8">
              {(Object.keys(THEME_CATEGORIES) as CardTheme[]).map((theme) => {
                const c = THEME_CATEGORIES[theme];
                const isSelected = s.selectedTheme === theme;
                const count = s.available.filter((card) => card.theme === theme).length;
                return (
                  <motion.button key={theme}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => s.setSelectedTheme(theme)}
                    className="relative overflow-hidden rounded-2xl flex flex-col items-center justify-end pb-3 shadow-sm aspect-[2/3]"
                    style={{
                      background: c.gradient,
                      boxShadow: isSelected
                        ? `0 0 0 3px ${colors.premium}, 0 8px 24px ${c.border}70`
                        : `0 2px 10px ${c.border}40`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1.5px,transparent_1.5px)] bg-[length:12px_12px]" />
                    <span className="absolute top-2 left-2.5 text-white/30"><DynamicIcon name={c.iconName} size={12} color="rgba(255,255,255,0.3)" /></span>
                    <span className="absolute bottom-10 right-2.5 text-white/30 rotate-180"><DynamicIcon name={c.iconName} size={12} color="rgba(255,255,255,0.3)" /></span>
                    <span className="relative z-10 mb-0.5"><DynamicIcon name={c.iconName} size={28} color="white" /></span>
                    <p className="text-white font-black text-xs text-center leading-tight relative z-10 px-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.35)]">{c.name}</p>
                    <p className="text-white/55 text-xs relative z-10">{count}</p>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={s.startPlaying}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
              style={{ background: colors.premiumGradient, boxShadow: `0 6px 24px ${colors.premiumShadow}` }}
            >
              {s.sessionMode === 'seance' ? t('cardGame.startSeance', { count: s.seanceSize }) : t('cardGame.drawCard')}
              <ChevronRight size={20} />
            </motion.button>
            </>)}
          </motion.div>
        )}

        {/* ── PLAYING ──────────────────────────────────────── */}
        {s.step === 'playing' && s.currentCard && s.cat && (
          <motion.div key="playing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col px-5 pt-5 pb-5"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm" style={{ background: s.cat.gradient }}>
                <DynamicIcon name={s.cat.iconName} size={14} color="white" />
                <span className="text-white font-bold text-xs tracking-wide [text-shadow:0_1px_3px_rgba(0,0,0,0.25)]">{s.cat.name}</span>
              </div>
              <span className="text-xs font-semibold" style={{ color: colors.textMuted }}>
                {s.sessionMode === 'seance' ? `${s.cardCount} / ${s.seanceSize}` : `#${s.cardCount}`}
              </span>
              <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                {s.isSolo ? <><User size={12} /><span>{t('diceGame.solo.title')}</span></> : <><Users size={12} /><span>{t('diceGame.duo.title')}</span></>}
              </div>
            </div>

            {s.sessionMode === 'seance' && (
              <div className="flex items-center gap-1.5 justify-center mb-5">
                {Array.from({ length: s.seanceSize }).map((_, i) => (
                  <motion.div key={i}
                    animate={{ scale: i === s.cardCount - 1 ? [1, 1.4, 1] : 1 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      width: i < s.cardCount ? 8 : 6, height: i < s.cardCount ? 8 : 6,
                      borderRadius: 999,
                      background: i < s.cardCount ? colors.premiumGradient : colors.border,
                      transition: 'width 0.3s, height 0.3s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Card — AnimatePresence by card.id triggers entrance animation */}
            <div className="flex items-center justify-center mb-4">
              <AnimatePresence>
                <motion.div
                  key={s.currentCard.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ width: '100%' }}
                >
                  <PlayingCard
                    card={s.currentCard}
                    cat={s.cat}
                    isRevealed={s.isRevealed}
                    isAnimating={s.isAnimating}
                    deckRemaining={deckRemaining}
                    onDraw={s.isSeanceDone ? handleGoToEnd : s.drawNewCard}
                    themeId={themeId}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions — apparaissent après la révélation, créent le moment de lecture */}
            <AnimatePresence>
              {s.isRevealed && (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  {/* Hint + favori */}
                  <div className="flex items-center gap-3 px-1">
                    <p className="text-xs flex-1" style={{ color: colors.textMuted }}>
                      {s.isSolo ? t('cardGame.hintSolo') : t('cardGame.hintDuo')}
                    </p>
                    <motion.button
                      whileTap={{ scale: 1.35 }}
                      onClick={() => s.toggleFavorite(s.currentCard!.id)}
                      className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all"
                      style={s.isFavCard
                        ? { borderColor: '#fecdd3', background: '#fff1f2' }
                        : { borderColor: colors.border, background: colors.bgCard }}
                    >
                      <Heart size={18} className={s.isFavCard ? 'text-rose-400 fill-rose-400' : 'text-gray-300'} />
                    </motion.button>
                  </div>

                  {/* CTA principal */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={s.isSeanceDone ? handleGoToEnd : s.drawNewCard}
                    disabled={s.isAnimating}
                    className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                    style={{
                      background: s.isSeanceDone ? `linear-gradient(135deg, ${colors.success}, ${colors.success}bb)` : colors.premiumGradient,
                      boxShadow: s.isSeanceDone ? `0 6px 24px ${colors.success}40` : `0 6px 24px ${colors.premiumShadow}`,
                      opacity: s.isAnimating ? 0.55 : 1,
                      transition: 'background 0.4s, box-shadow 0.4s, opacity 0.2s',
                    }}
                  >
                    {s.isSeanceDone
                      ? <><Trophy size={18} />{t('cardGame.endSeance')}</>
                      : <><Shuffle size={18} />{t('cardGame.newCard')}</>}
                  </motion.button>

                  {/* Changer de deck — action secondaire, discret */}
                  <motion.button
                    whileTap={{ opacity: 0.6 }}
                    onClick={s.reset}
                    className="w-full py-2 flex items-center justify-center gap-1.5"
                    style={{ color: colors.textMuted }}
                  >
                    <RotateCcw size={12} />
                    <span className="text-xs">{t('cardGame.changeDeck')}</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── END ──────────────────────────────────────────── */}
        {s.step === 'end' && (
          <motion.div key="end"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="relative"
          >
            <GameEndCinematic primaryColor={colors.accent} secondaryColor={colors.accentLight} intensity="medium" darkOverlay />
            <div className="relative z-10 flex flex-col items-center px-6 pt-8 pb-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
              className="mb-5 text-white/90"
            >
              <Sparkles size={52} />
            </motion.div>

            <h3 className="text-2xl font-black mb-2 text-white">{t('cardGame.endTitle')}</h3>
            <p className="text-sm mb-7 leading-relaxed text-white/65">
              {s.seanceSize} {t('cardGame.cardUnit')} · {s.sessionThemes.length} {s.sessionThemes.length > 1 ? t('cardGame.decksExplored') : t('cardGame.deckExplored')}
              {s.favorites.length > 0 && <> · <Heart size={12} className="inline align-middle" /> {s.favorites.length} {s.favorites.length > 1 ? t('cardGame.favUnitPlural') : t('cardGame.favUnit')}</>}
            </p>

            {s.sessionThemes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-white/45">{t('cardGame.exploredDecksLabel')}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {s.sessionThemes.map((theme) => {
                    const c = THEME_CATEGORIES[theme];
                    return (
                      <div key={theme} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: c.gradient }}>
                        <DynamicIcon name={c.iconName} size={12} color="white" />
                        <span className="[text-shadow:0_1px_3px_rgba(0,0,0,0.2)]">{c.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <CardUnlockReveal cards={gainedCards} />

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full p-4 rounded-2xl mb-7"
              style={{ background: colors.rareBg, border: `1px solid ${colors.rare}4d` }}>
              <p className="text-sm leading-relaxed text-white/82">{endInsight}</p>
            </motion.div>

            <div className="w-full space-y-2.5">
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={s.reset}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: colors.premiumGradient, boxShadow: `0 6px 24px ${colors.premiumShadow}` }}
              >
                <Sparkles size={18} />{t('cardGame.newSeance')}
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { s.setSessionMode('libre'); s.startPlaying(); }}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-white/20 bg-white/[0.08] text-white/75"
              >
                <Shuffle size={14} />{t('cardGame.continueLibre')}
              </motion.button>
              {gainedCards.length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate?.('hall-of-cards')}
                  className="w-full py-2.5 text-xs font-medium text-center"
                  style={{ color: colors.premium }}
                >
                  {t('cardGame.viewCollection')}
                </motion.button>
              )}
            </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
