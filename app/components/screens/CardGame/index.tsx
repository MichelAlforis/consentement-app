'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, RotateCcw, Shuffle, ChevronRight, Sparkles, Heart, Trophy } from 'lucide-react';
import { DICE_CATEGORIES } from '../../../data';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from '../../../i18n';
import { useCardSession } from './hooks/useCardSession';
import { PlayingCard } from './PlayingCard';

interface CardGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
}

export function CardGameScreen({ isAdult }: CardGameScreenProps) {
  const { colors, id: themeId } = useTheme();
  const { t } = useTranslation();
  const s = useCardSession(isAdult);

  const deckRemaining = s.sessionMode === 'seance'
    ? Math.max(0, s.seanceSize - s.cardCount)
    : s.isSeanceDone ? 0 : 3;

  const endInsight = s.sessionDecks.some((d) => [5, 6].includes(d))
    ? t('cardGame.insight1')
    : s.sessionDecks.some((d) => [2, 3].includes(d))
      ? t('cardGame.insight2')
      : t('cardGame.insight3');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
      <AnimatePresence mode="wait">

        {/* ── PICK ─────────────────────────────────────────── */}
        {s.step === 'pick' && (
          <motion.div key="pick"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="flex flex-col px-5 pt-5 pb-10"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none" style={{ color: colors.textPrimary }}>{t('cardGame.title')}</h2>
                <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                  {s.available.length} {t('cardGame.cardUnit')}
                  {s.favorites.length > 0 && (
                    <span className="ml-2 text-rose-400">· ❤️ {s.favorites.length} {s.favorites.length > 1 ? t('cardGame.favUnitPlural') : t('cardGame.favUnit')}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <Sparkles size={11} className="text-white" />
                <span className="text-xs font-bold text-white tracking-widest">PREMIUM</span>
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
                        ? { borderColor: '#8b5cf6', background: '#f5f3ff', color: '#7c3aed' }
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
                      ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }
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
                        ? { borderColor: '#8b5cf6', background: '#f5f3ff', color: '#7c3aed' }
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
              onClick={() => s.setSelectedDeck('random')}
              className="w-full mb-3 p-4 rounded-2xl border-2 flex items-center gap-4 transition-all"
              style={s.selectedDeck === 'random'
                ? { borderColor: '#8b5cf6', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }
                : { borderColor: colors.border, background: colors.bgSecondary }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #ec4899 70%, #f59e0b 100%)' }}>
                <Shuffle size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: s.selectedDeck === 'random' ? '#7c3aed' : colors.textPrimary }}>{t('cardGame.random')}</p>
                <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{t('cardGame.randomDesc', { count: s.available.length })}</p>
              </div>
              {s.selectedDeck === 'random' && (
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              )}
            </motion.button>

            <div className="grid grid-cols-3 gap-2.5 mb-8">
              {([1, 2, 3, 4, 5, 6] as const).map((d) => {
                const c = DICE_CATEGORIES[d];
                const isSelected = s.selectedDeck === d;
                const count = s.available.filter((card) => card.deck === d).length;
                return (
                  <motion.button key={d}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => s.setSelectedDeck(d)}
                    className="relative overflow-hidden rounded-2xl flex flex-col items-center justify-end pb-3 shadow-sm"
                    style={{
                      aspectRatio: '2 / 3',
                      background: c.gradient,
                      boxShadow: isSelected
                        ? `0 0 0 3px #8b5cf6, 0 8px 24px ${c.border}70`
                        : `0 2px 10px ${c.border}40`,
                    }}
                  >
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />
                    <span className="absolute top-2 left-2.5 text-xs text-white/40 font-black leading-none">{c.emoji}</span>
                    <span className="absolute bottom-10 right-2.5 text-xs text-white/40 font-black leading-none" style={{ transform: 'rotate(180deg)' }}>{c.emoji}</span>
                    <span className="text-2xl relative z-10 mb-0.5">{c.emoji}</span>
                    <p className="text-white font-black text-xs text-center leading-tight relative z-10 px-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{t(`diceCategories.${d}`)}</p>
                    <p className="text-white/55 text-xs relative z-10">{count}</p>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={s.startPlaying}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 6px 24px #8b5cf655' }}
            >
              {s.sessionMode === 'seance' ? t('cardGame.startSeance', { count: s.seanceSize }) : t('cardGame.drawCard')}
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* ── PLAYING ──────────────────────────────────────── */}
        {s.step === 'playing' && s.currentCard && s.cat && (
          <motion.div key="playing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col px-5 pt-5 pb-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm" style={{ background: s.cat.gradient }}>
                <span className="text-sm leading-none">{s.cat.emoji}</span>
                <span className="text-white font-bold text-xs tracking-wide" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>{t(`diceCategories.${s.currentCard.deck}`)}</span>
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
                      background: i < s.cardCount ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : colors.border,
                      transition: 'width 0.3s, height 0.3s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Card — AnimatePresence by card.id triggers entrance animation */}
            <div className="flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.currentCard.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ width: '100%' }}
                >
                  <PlayingCard
                    card={s.currentCard}
                    cat={s.cat}
                    isRevealed={s.isRevealed}
                    isAnimating={s.isAnimating}
                    deckRemaining={deckRemaining}
                    onDraw={s.isSeanceDone ? s.goToEnd : s.drawNewCard}
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
                    onClick={s.isSeanceDone ? s.goToEnd : s.drawNewCard}
                    disabled={s.isAnimating}
                    className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                    style={{
                      background: s.isSeanceDone ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      boxShadow: s.isSeanceDone ? '0 6px 24px #10b98140' : '0 6px 24px #8b5cf640',
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
            className="flex flex-col items-center px-6 pt-8 pb-10 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
              className="text-6xl mb-5"
            >✨</motion.div>

            <h3 className="text-2xl font-black mb-2" style={{ color: colors.textPrimary }}>{t('cardGame.endTitle')}</h3>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: colors.textMuted }}>
              {s.seanceSize} {t('cardGame.cardUnit')} · {s.sessionDecks.length} {s.sessionDecks.length > 1 ? t('cardGame.decksExplored') : t('cardGame.deckExplored')}
              {s.favorites.length > 0 && ` · ❤️ ${s.favorites.length} ${s.favorites.length > 1 ? t('cardGame.favUnitPlural') : t('cardGame.favUnit')}`}
            </p>

            {s.sessionDecks.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>{t('cardGame.exploredDecksLabel')}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {s.sessionDecks.map((d) => {
                    const c = DICE_CATEGORIES[d];
                    return (
                      <div key={d} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: c.gradient }}>
                        <span>{c.emoji}</span>
                        <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{t(`diceCategories.${d}`)}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full p-4 rounded-2xl bg-violet-50 border border-violet-100 mb-7">
              <p className="text-sm text-violet-700 leading-relaxed">{endInsight}</p>
            </motion.div>

            <div className="w-full space-y-2.5">
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={s.reset}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 6px 24px #8b5cf640' }}
              >
                <Sparkles size={18} />{t('cardGame.newSeance')}
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { s.setSessionMode('libre'); s.startPlaying(); }}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ border: `1px solid ${colors.border}`, background: colors.bgCard, color: colors.textSecondary }}
              >
                <Shuffle size={14} />{t('cardGame.continueLibre')}
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
