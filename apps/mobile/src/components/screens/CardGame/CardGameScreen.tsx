// V4 divergence: navigation via useNavigationStore (pas de Next.js router)
// V4 divergence: ownedCards depuis useUnlockStore() (@ouiclair/core), pas de props
import { useState, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet,
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import {
  RotateCcw, Shuffle, ChevronRight, Sparkles, Heart, Trophy,
  User, Users,
} from 'lucide-react-native';
import {
  THEME_CATEGORIES,
  computeGainedCards,
  getCollectorCardById,
  collectorCards,
  useUnlockStore,
  useNavigationStore,
  usePremiumStore,
  useAuthStore,
  type GainedCard,
  type Screen,
} from '@ouiclair/core';
import { useTranslation } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeContext';
import { GameEndCinematic } from '../../../game-engine/shared/GameEndCinematic';
import { CollectorCardCanvas } from '../../../game-engine/cards/CollectorCardCanvas.native';
import { useHaptics } from '../../../game-engine/shared/useHaptics';
import { useCardSession } from './hooks/useCardSession';
import { PlayingCard } from './PlayingCard';
import type { CardTheme } from '@ouiclair/core';

// ─── CardUnlockReveal ─────────────────────────────────────────────────────────

function CardUnlockReveal({ cards }: { cards: GainedCard[] }) {
  const [mountedCount, setMountedCount] = useState(0);
  const [flipped, setFlipped]           = useState<Record<string, boolean>>({});
  const { vibrate } = useHaptics();
  const { t } = useTranslation();

  const cardSize   = cards.length === 1 ? 160 : cards.length === 2 ? 150 : 140;
  const isScrollable = cards.length >= 3;

  useState(() => {
    if (cards.length === 0) return;
    cards.forEach((card, i) => {
      setTimeout(() => setMountedCount(n => Math.max(n, i + 1)), 300 + i * 550);
      setTimeout(() => setFlipped(f => ({ ...f, [card.id]: true })), 300 + i * 550 + 800);
    });
  });

  if (cards.length === 0) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 350, type: 'timing', duration: 400 }}
      style={{ width: '100%', marginBottom: 24 }}
    >
      <Text style={styles.cardsUnlockedLabel}>
        {cards.length > 1
          ? t('flipReveal.cardsUnlockedLabel', { count: cards.length })
          : t('flipReveal.cardUnlockedLabel')}
      </Text>

      <ScrollView
        horizontal={isScrollable}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={isScrollable
          ? { paddingHorizontal: 20, gap: 12 }
          : { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 16 }
        }
        style={isScrollable ? undefined : undefined}
      >
        {cards.slice(0, mountedCount).map((card) => (
          <Pressable
            key={card.id}
            onPress={() => {
              void vibrate('light');
              setFlipped(f => ({ ...f, [card.id]: !f[card.id] }));
            }}
            style={{ width: cardSize, height: Math.round(cardSize * 1.5) }}
          >
            <CollectorCardCanvas
              card={card}
              isFlipped={!!flipped[card.id]}
              size={cardSize}
            />
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.hintText}>
        {isScrollable ? t('flipReveal.hintScroll') : t('flipReveal.hintTap')}
      </Text>
    </MotiView>
  );
}

// ─── CardGameScreen ───────────────────────────────────────────────────────────

export function CardGameScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const isAdult   = useAuthStore((s) => s.isAdult) ?? false;
  const isPremium = usePremiumStore((s) => s.isPremium);
  const { ownedCards, sessionCount, unlockCards, incrementSessionCount, drawFromPool } = useUnlockStore();
  const s = useCardSession(isAdult);
  const [gainedCards, setGainedCards] = useState<GainedCard[]>([]);

  const handleGoToEnd = useCallback(() => {
    const ownedIds = new Set(ownedCards.map((c) => c.id));
    const nextSessionCount = sessionCount + 1;

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

    // V4 divergence: incrementSessionCount + drawFromPool depuis unlockStore
    incrementSessionCount();
    const drawn = drawFromPool();
    if (drawn) {
      const card = getCollectorCardById(drawn.id);
      if (card) {
        gained.push({
          id: card.id, text: card.text,
          theme: card.theme,
          rarity: card.rarity, gradient: card.visual.gradient,
          iconName: card.visual.iconName, border: card.visual.border,
        });
      }
    }

    setGainedCards(gained);
    s.goToEnd();
  }, [ownedCards, sessionCount, s, unlockCards, isPremium, incrementSessionCount, drawFromPool]);

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
    <View style={{ flex: 1 }}>
      <AnimatePresence>

        {/* ── PICK ─────────────────────────────────────────── */}
        {s.step === 'pick' && (
          <MotiView
            key="pick"
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -16 }}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Empty deck guard */}
              {s.available.length === 0 && (
                <MotiView
                  from={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.emptyContainer}
                >
                  <View style={[styles.emptyIcon, { backgroundColor: colors.premiumGradient as unknown as string }]}>
                    <Sparkles size={36} color="#fff" />
                  </View>
                  <View>
                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                      {t('cardGame.emptyTitle')}
                    </Text>
                    <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                      {t('cardGame.emptyDesc')}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => navigateTo('quiz-consentement' as Screen)}
                    style={[styles.ctaButton, { backgroundColor: colors.premium }]}
                  >
                    <ChevronRight size={18} color="#fff" />
                    <Text style={styles.ctaButtonText}>{t('cardGame.emptyCTA')}</Text>
                  </Pressable>
                </MotiView>
              )}

              {s.available.length > 0 && (
                <>
                  {/* Header */}
                  <View style={styles.headerRow}>
                    <View>
                      <Text style={[styles.title, { color: colors.textPrimary }]}>
                        {t('cardGame.title')}
                      </Text>
                      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                        {s.available.length} {t('cardGame.cardUnit')}
                        {s.favorites.length > 0 && (
                          <Text style={{ color: '#fb7185' }}>
                            {' '}· ♥ {s.favorites.length} {s.favorites.length > 1 ? t('cardGame.favUnitPlural') : t('cardGame.favUnit')}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={[styles.premiumBadge, { backgroundColor: colors.premium }]}>
                      <Sparkles size={11} color="#fff" />
                      <Text style={styles.premiumBadgeText}>{t('games.premium')}</Text>
                    </View>
                  </View>

                  {/* Settings block */}
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    {t('cardGame.settings')}
                  </Text>
                  <View style={[styles.settingsBlock, { backgroundColor: colors.bgSecondary }]}>
                    {/* Solo / Duo */}
                    <View style={styles.modeRow}>
                      {([
                        [true, User, t('diceGame.solo.title')],
                        [false, Users, t('diceGame.duo.title')],
                      ] as [boolean, typeof User, string][]).map(([solo, Icon, label]) => {
                        const active = s.isSolo === solo;
                        return (
                          <Pressable
                            key={label}
                            onPress={() => s.setIsSolo(solo)}
                            style={[
                              styles.modeButton,
                              active
                                ? { borderColor: colors.premium, backgroundColor: colors.premiumLight }
                                : { borderColor: 'transparent', backgroundColor: colors.bgCard },
                            ]}
                          >
                            <Icon size={14} color={active ? colors.premium : colors.textMuted} />
                            <Text style={[styles.modeButtonText, { color: active ? colors.premium : colors.textMuted }]}>
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    {/* Séance / Libre */}
                    <View style={[styles.segmentRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                      {(['seance', 'libre'] as const).map((mode) => (
                        <Pressable
                          key={mode}
                          onPress={() => s.setSessionMode(mode)}
                          style={[
                            styles.segmentButton,
                            s.sessionMode === mode && { backgroundColor: colors.premium },
                          ]}
                        >
                          <Text style={[
                            styles.segmentText,
                            { color: s.sessionMode === mode ? '#fff' : colors.textMuted },
                          ]}>
                            {mode === 'seance' ? t('cardGame.seanceMode') : t('cardGame.libreMode')}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* Taille séance */}
                    {s.sessionMode === 'seance' && (
                      <View style={styles.modeRow}>
                        {([5, 10] as const).map((n) => (
                          <Pressable
                            key={n}
                            onPress={() => s.setSeanceSize(n)}
                            style={[
                              styles.modeButton,
                              s.seanceSize === n
                                ? { borderColor: colors.premium, backgroundColor: colors.premiumLight }
                                : { borderColor: colors.border, backgroundColor: 'transparent' },
                            ]}
                          >
                            <Text style={[styles.modeButtonText, { color: s.seanceSize === n ? colors.premium : colors.textMuted }]}>
                              {n} {t('cardGame.cardUnit')}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Deck selector */}
                  <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                    {t('cardGame.deckLabel')}
                  </Text>

                  {/* Random option */}
                  <Pressable
                    onPress={() => s.setSelectedTheme('random')}
                    style={[
                      styles.deckOption,
                      s.selectedTheme === 'random'
                        ? { borderColor: colors.premium, backgroundColor: colors.premiumLight }
                        : { borderColor: colors.border, backgroundColor: colors.bgSecondary },
                    ]}
                  >
                    <View style={styles.deckRandomIcon}>
                      <Shuffle size={22} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.deckOptionTitle, { color: s.selectedTheme === 'random' ? colors.premium : colors.textPrimary }]}>
                        {t('cardGame.random')}
                      </Text>
                      <Text style={[styles.deckOptionDesc, { color: colors.textMuted }]}>
                        {t('cardGame.randomDesc', { count: s.available.length })}
                      </Text>
                    </View>
                    {s.selectedTheme === 'random' && (
                      <View style={[styles.radioCheck, { backgroundColor: colors.premium }]}>
                        <View style={styles.radioCheckInner} />
                      </View>
                    )}
                  </Pressable>

                  {/* Theme grid */}
                  <View style={styles.themeGrid}>
                    {(Object.keys(THEME_CATEGORIES) as CardTheme[]).map((theme) => {
                      const c = THEME_CATEGORIES[theme];
                      const isSelected = s.selectedTheme === theme;
                      const count = s.available.filter((card) => card.theme === theme).length;
                      return (
                        <Pressable
                          key={theme}
                          onPress={() => s.setSelectedTheme(theme)}
                          style={[
                            styles.themeCard,
                            { backgroundColor: c.border + '20' },
                            isSelected && { borderWidth: 2.5, borderColor: colors.premium },
                          ]}
                        >
                          <Text style={styles.themeCardText}>{c.name}</Text>
                          <Text style={[styles.themeCardCount, { color: colors.textMuted }]}>{count}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Start button */}
                  <Pressable
                    onPress={s.startPlaying}
                    style={[styles.ctaButton, styles.ctaButtonFull, { backgroundColor: colors.premium }]}
                  >
                    <Text style={styles.ctaButtonText}>
                      {s.sessionMode === 'seance'
                        ? t('cardGame.startSeance', { count: s.seanceSize })
                        : t('cardGame.drawCard')}
                    </Text>
                    <ChevronRight size={20} color="#fff" />
                  </Pressable>
                </>
              )}
            </ScrollView>
          </MotiView>
        )}

        {/* ── PLAYING ──────────────────────────────────────── */}
        {s.step === 'playing' && s.currentCard && s.cat && (
          <MotiView
            key="playing"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Header */}
              <View style={styles.playingHeader}>
                <View style={[styles.catBadge, { backgroundColor: s.cat.gradient as unknown as string }]}>
                  <Text style={styles.catBadgeText}>{s.cat.name}</Text>
                </View>
                <Text style={[styles.countText, { color: colors.textMuted }]}>
                  {s.sessionMode === 'seance'
                    ? `${s.cardCount} / ${s.seanceSize}`
                    : `#${s.cardCount}`}
                </Text>
                <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {s.isSolo
                    ? <><User size={12} color={colors.textMuted} /><Text style={{ color: colors.textMuted, fontSize: 12 }}>{t('diceGame.solo.title')}</Text></>
                    : <><Users size={12} color={colors.textMuted} /><Text style={{ color: colors.textMuted, fontSize: 12 }}>{t('diceGame.duo.title')}</Text></>}
                </View>
              </View>

              {/* Séance progress dots */}
              {s.sessionMode === 'seance' && (
                <View style={styles.progressDots}>
                  {Array.from({ length: s.seanceSize }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.progressDot,
                        {
                          width: i < s.cardCount ? 8 : 6,
                          height: i < s.cardCount ? 8 : 6,
                          backgroundColor: i < s.cardCount ? colors.premium : colors.border,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}

              {/* PlayingCard */}
              <View style={styles.cardContainer}>
                <AnimatePresence>
                  <MotiView
                    key={s.currentCard.id}
                    from={{ opacity: 0, translateY: 22 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 350 }}
                    style={{ width: '100%', alignItems: 'center' }}
                  >
                    <PlayingCard
                      card={s.currentCard}
                      cat={s.cat}
                      isRevealed={s.isRevealed}
                      isAnimating={s.isAnimating}
                      deckRemaining={deckRemaining}
                      onDraw={s.isSeanceDone ? handleGoToEnd : s.drawNewCard}
                    />
                  </MotiView>
                </AnimatePresence>
              </View>

              {/* Actions post-révélation */}
              <AnimatePresence>
                {s.isRevealed && (
                  <MotiView
                    key="actions"
                    from={{ opacity: 0, translateY: 8 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 200, type: 'timing', duration: 300 }}
                    style={styles.actionsContainer}
                  >
                    {/* Hint + favori */}
                    <View style={styles.hintRow}>
                      <Text style={[styles.hintSmall, { color: colors.textMuted }]}>
                        {s.isSolo ? t('cardGame.hintSolo') : t('cardGame.hintDuo')}
                      </Text>
                      <Pressable
                        onPress={() => s.toggleFavorite(s.currentCard!.id)}
                        style={[
                          styles.favButton,
                          s.isFavCard
                            ? { borderColor: '#fecdd3', backgroundColor: '#fff1f2' }
                            : { borderColor: colors.border, backgroundColor: colors.bgCard },
                        ]}
                      >
                        <Heart
                          size={18}
                          color={s.isFavCard ? '#f43f5e' : '#d1d5db'}
                          fill={s.isFavCard ? '#f43f5e' : 'transparent'}
                        />
                      </Pressable>
                    </View>

                    {/* CTA principal */}
                    <Pressable
                      onPress={s.isSeanceDone ? handleGoToEnd : s.drawNewCard}
                      disabled={s.isAnimating}
                      style={[
                        styles.ctaButton,
                        styles.ctaButtonFull,
                        {
                          backgroundColor: s.isSeanceDone
                            ? colors.success
                            : colors.premium,
                          opacity: s.isAnimating ? 0.55 : 1,
                        },
                      ]}
                    >
                      {s.isSeanceDone
                        ? <><Trophy size={18} color="#fff" /><Text style={styles.ctaButtonText}>{t('cardGame.endSeance')}</Text></>
                        : <><Shuffle size={18} color="#fff" /><Text style={styles.ctaButtonText}>{t('cardGame.newCard')}</Text></>}
                    </Pressable>

                    {/* Changer de deck */}
                    <Pressable onPress={s.reset} style={styles.resetButton}>
                      <RotateCcw size={12} color={colors.textMuted} />
                      <Text style={[styles.resetButtonText, { color: colors.textMuted }]}>
                        {t('cardGame.changeDeck')}
                      </Text>
                    </Pressable>
                  </MotiView>
                )}
              </AnimatePresence>
            </ScrollView>
          </MotiView>
        )}

        {/* ── END ──────────────────────────────────────────── */}
        {s.step === 'end' && (
          <MotiView
            key="end"
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1 }}
          >
            <GameEndCinematic primaryColor={colors.accent} secondaryColor={colors.accentLight} intensity="medium" darkOverlay />
            <ScrollView contentContainerStyle={[styles.scrollContent, styles.endScrollContent]}>
              <MotiView
                from={{ scale: 0, rotate: '-15deg' }}
                animate={{ scale: 1, rotate: '0deg' }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 100 }}
                style={{ marginBottom: 20 }}
              >
                <Sparkles size={52} color="rgba(255,255,255,0.9)" />
              </MotiView>

              <Text style={styles.endTitle}>{t('cardGame.endTitle')}</Text>
              <Text style={styles.endSubtitle}>
                {s.seanceSize} {t('cardGame.cardUnit')} · {s.sessionThemes.length}{' '}
                {s.sessionThemes.length > 1 ? t('cardGame.decksExplored') : t('cardGame.deckExplored')}
                {s.favorites.length > 0 && (
                  <Text> · ♥ {s.favorites.length} {s.favorites.length > 1 ? t('cardGame.favUnitPlural') : t('cardGame.favUnit')}</Text>
                )}
              </Text>

              {/* Decks explorés */}
              {s.sessionThemes.length > 0 && (
                <MotiView
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 250 }}
                  style={styles.exploredDecks}
                >
                  <Text style={styles.exploredDecksLabel}>{t('cardGame.exploredDecksLabel')}</Text>
                  <View style={styles.exploredDecksRow}>
                    {s.sessionThemes.map((theme) => {
                      const c = THEME_CATEGORIES[theme];
                      return (
                        <View key={theme} style={[styles.exploredBadge, { backgroundColor: c.border + '40' }]}>
                          <Text style={styles.exploredBadgeText}>{c.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </MotiView>
              )}

              <CardUnlockReveal cards={gainedCards} />

              {/* Insight */}
              <MotiView
                from={{ opacity: 0, translateY: 8 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 400 }}
                style={[styles.insightBlock, { backgroundColor: colors.rareBg, borderColor: colors.rare + '4d' }]}
              >
                <Text style={styles.insightText}>{endInsight}</Text>
              </MotiView>

              {/* Actions fin */}
              <View style={styles.endActions}>
                <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 500 }}>
                  <Pressable
                    onPress={s.reset}
                    style={[styles.ctaButton, styles.ctaButtonFull, { backgroundColor: colors.premium }]}
                  >
                    <Sparkles size={18} color="#fff" />
                    <Text style={styles.ctaButtonText}>{t('cardGame.newSeance')}</Text>
                  </Pressable>
                </MotiView>

                <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 550 }}>
                  <Pressable
                    onPress={() => { s.setSessionMode('libre'); s.startPlaying(); }}
                    style={[styles.secondaryButton]}
                  >
                    <Shuffle size={14} color="rgba(255,255,255,0.75)" />
                    <Text style={styles.secondaryButtonText}>{t('cardGame.continueLibre')}</Text>
                  </Pressable>
                </MotiView>

                {gainedCards.length > 0 && (
                  <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 700 }}>
                    <Pressable onPress={() => navigateTo('hall-of-cards' as Screen)} style={styles.ghostButton}>
                      <Text style={[styles.ghostButtonText, { color: colors.premium }]}>
                        {t('cardGame.viewCollection')}
                      </Text>
                    </Pressable>
                  </MotiView>
                )}
              </View>
            </ScrollView>
          </MotiView>
        )}

      </AnimatePresence>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  endScrollContent: {
    alignItems: 'center',
  },
  // Headers
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexShrink: 0,
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  // Settings
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  settingsBlock: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    gap: 10,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    gap: 2,
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Deck selection
  deckOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  deckRandomIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#6366f1',
  },
  deckOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  deckOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  radioCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheckInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  themeCard: {
    width: '30%',
    aspectRatio: 2 / 3,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
    overflow: 'hidden',
  },
  themeCardText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  themeCardCount: {
    fontSize: 11,
    marginTop: 2,
  },
  // CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaButtonFull: {
    width: '100%',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  // Playing
  playingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  catBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 20,
  },
  progressDot: {
    borderRadius: 999,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  hintSmall: {
    flex: 1,
    fontSize: 12,
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    flexShrink: 0,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  resetButtonText: {
    fontSize: 12,
  },
  // End screen
  endTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  endSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  exploredDecks: {
    width: '100%',
    marginBottom: 24,
  },
  exploredDecksLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginBottom: 12,
  },
  exploredDecksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  exploredBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  exploredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  insightBlock: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 28,
    borderWidth: 1,
  },
  insightText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 20,
  },
  endActions: {
    width: '100%',
    gap: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  ghostButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostButtonText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  // Unlock reveal
  cardsUnlockedLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 20,
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.50)',
    textAlign: 'center',
    marginTop: 16,
  },
});
