// V4 divergence: navigation via useNavigationStore (pas de Next.js router)
// framer-motion → MotiView/AnimatePresence, className → StyleSheet RN
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import {
  Dices,
  User,
  Users,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Eye,
  EyeOff,
  PartyPopper,
  Handshake,
  Layers,
  MessageCircle,
  HelpCircle,
  Target,
  Sparkles,
  Heart,
} from 'lucide-react-native';
import {
  diePractices,
  DICE_CATEGORIES,
  sampleCardByFace,
  useSettingsStore,
  useUnlockStore,
  type GainedCard,
  type Screen,
} from '@ouiclair/core';
import { useTheme } from '../../../theme/ThemeContext';
import { useTranslation } from '../../../i18n';
import { Button } from '../../ui/Button';
import { CardFullscreenOverlay } from '../../ui/CardFullscreenOverlay';
import { useDiceEngine } from '../../../game-engine/dice/useDiceEngine';
import { DiceRenderer } from '../../../game-engine/dice/DiceRenderer';
import { GameEndCinematic } from '../../../game-engine/shared/GameEndCinematic';
import type { DiceConfig, DiceItem } from '../../../game-engine/dice/types';

// ─── Icon map pour les 6 catégories du dé ────────────────────────────────────

type LucideIconComponent = React.ComponentType<{ size?: number; color?: string }>;

const DICE_ICON_MAP: Record<number, LucideIconComponent> = {
  1: Layers,
  2: MessageCircle,
  3: HelpCircle,
  4: Target,
  5: Sparkles,
  6: Heart,
};

function DiceCategoryIcon({ faceId, size = 20, color = 'rgba(255,255,255,0.9)' }: {
  faceId: number;
  size?: number;
  color?: string;
}) {
  const IconComponent = DICE_ICON_MAP[faceId];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} />;
}

// ─── Config dé ───────────────────────────────────────────────────────────────

const DICE_CONFIG: DiceConfig = {
  faces: ([1, 2, 3, 4, 5, 6] as const).map((n) => ({
    id: n,
    label: DICE_CATEGORIES[n].name,
    iconName: DICE_CATEGORIES[n].iconName,
    gradient: DICE_CATEGORIES[n].gradient,
    border: DICE_CATEGORIES[n].border,
    color: DICE_CATEGORIES[n].border,
  })),
};

// ─── Types locaux ─────────────────────────────────────────────────────────────

type GameMode = 'pick' | 'rolling' | 'practice' | 'duo-p1' | 'duo-hidden' | 'duo-p2' | 'duo-reveal';
type DuoAnswer = 'yes' | 'no' | null;

export interface DiceGameScreenProps {
  isPremium: boolean;
  isAdult: boolean;
  onNavigate?: (screen: Screen) => void;
}

// ─── Écran principal ─────────────────────────────────────────────────────────

export function DiceGameScreen({ isPremium, isAdult, onNavigate }: DiceGameScreenProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const explicitMode = useSettingsStore((s) => s.explicitMode);
  const { ownedCards } = useUnlockStore();

  const [mode, setMode] = useState<GameMode>('pick');
  const [isSolo, setIsSolo] = useState(true);
  const [p1Answer, setP1Answer] = useState<DuoAnswer>(null);
  const [p2Answer, setP2Answer] = useState<DuoAnswer>(null);
  const [rollCount, setRollCount] = useState(0);
  const [previewCard, setPreviewCard] = useState<GainedCard | null>(null);
  const [showCardPreview, setShowCardPreview] = useState(false);

  const available = useMemo(() => diePractices.filter((p) => {
    if (p.ageGate === 'all') return true;
    if (p.ageGate === 'adult') return isAdult;
    if (p.ageGate === 'explicit') return isAdult && explicitMode;
    if (p.ageGate === 'premium') return isAdult && isPremium;
    return false;
  }), [isAdult, isPremium, explicitMode]);

  const diceItems = useMemo<DiceItem[]>(
    () => available.map((p) => ({ id: p.id, faceId: p.face, text: p.text })),
    [available],
  );

  const { currentFace, currentItem, isRolling, roll, onRollComplete } = useDiceEngine(DICE_CONFIG, diceItems);
  const currentCat = currentItem ? DICE_CATEGORIES[currentItem.faceId] : null;
  const currentCatName = currentItem ? t(`diceCategories.${currentItem.faceId}`) : '';
  const bothYes = p1Answer === 'yes' && p2Answer === 'yes';

  const samplePreviewCard = (faceId: number) => sampleCardByFace(faceId, ownedCards);

  const pickRoll = (solo: boolean) => {
    setIsSolo(solo);
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    setShowCardPreview(false);
    setPreviewCard(null);
    setRollCount((c) => c + 1);
    roll();
  };

  const reroll = () => {
    setMode('rolling');
    setP1Answer(null);
    setP2Answer(null);
    setShowCardPreview(false);
    setPreviewCard(null);
    setRollCount((c) => c + 1);
    roll();
  };

  const reset = () => {
    setMode('pick');
    setP1Answer(null);
    setP2Answer(null);
    setShowCardPreview(false);
    setPreviewCard(null);
  };

  const handleQuit = () => {
    if (rollCount > 0) {
      const { incrementSessionCount, drawFromPool } = useUnlockStore.getState();
      incrementSessionCount();
      const drawn = drawFromPool();
      if (drawn) { onNavigate?.('hall-of-cards'); return; }
    }
    onNavigate?.('jeux');
  };

  return (
    <>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: '#fef3c7' }]}>
            <Dices size={22} color="#d97706" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t('diceGame.title')}</Text>
            <Text style={[styles.headerSub, { color: colors.textMuted }]}>{t('diceGame.available', { count: available.length })}</Text>
          </View>
        </View>

        {/* Pas d'AnimatePresence : moti viole Rules of Hooks avec plusieurs enfants conditionnels simultanés.
            MotiView + key unique = enter animation sans exit, pattern stable. */}
        <>

          {/* PICK */}
          {mode === 'pick' && (
            <MotiView
              key="pick"
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.flex1}
            >
              <View style={styles.diceCenter}>
                <DiceRenderer config={DICE_CONFIG} currentFace={null} isRolling={false} renderer="webgl" mode="numeric" size={180} />
              </View>

              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('diceGame.howToPlay')}</Text>

              <View style={styles.modeList}>
                {([
                  [true,  t('diceGame.solo.title'), t('diceGame.solo.desc'),  '#fef3c7', '#fbbf24', <User key="u" size={22} color="#f59e0b" />],
                  [false, t('diceGame.duo.title'),  t('diceGame.duo.desc'),   '#fff7ed', '#fed7aa', <Users key="us" size={22} color="#f97316" />],
                ] as [boolean, string, string, string, string, React.ReactNode][]).map(([solo, title, desc, bg, border, icon]) => (
                  <Pressable
                    key={title}
                    onPress={() => pickRoll(solo as boolean)}
                    style={[styles.modeCard, { backgroundColor: colors.bgCard, borderColor: border }]}
                  >
                    <View style={[styles.modeIconBox, { backgroundColor: bg }]}>{icon}</View>
                    <View style={styles.modeText}>
                      <Text style={[styles.modeTitle, { color: colors.textPrimary }]}>{title}</Text>
                      <Text style={[styles.modeDesc, { color: colors.textMuted }]}>{desc}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={styles.categoriesSection}>
                <Text style={[styles.categoriesLabel, { color: colors.textMuted }]}>{t('diceGame.categories')}</Text>
                <View style={styles.categoriesGrid}>
                  {Object.entries(DICE_CATEGORIES).map(([face, _c]) => (
                    <View
                      key={face}
                      style={[styles.categoryChip]}
                    >
                      <DiceCategoryIcon faceId={Number(face)} size={20} />
                      <Text style={styles.categoryChipLabel}>{t(`diceCategories.${face}`)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </MotiView>
          )}

          {/* ROLLING + PRACTICE */}
          {(mode === 'rolling' || mode === 'practice') && (
            <MotiView
              key="dice-view"
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.flex1}
            >
              <View style={styles.diceArea}>
                <DiceRenderer
                  config={DICE_CONFIG}
                  currentFace={currentFace}
                  isRolling={isRolling}
                  onRollComplete={() => {
                    onRollComplete();
                    setMode('practice');
                    const card = samplePreviewCard(currentItem?.faceId ?? 0);
                    setPreviewCard(card);
                  }}
                  renderer="webgl"
                  mode="numeric"
                  size={240}
                />

                {mode === 'rolling' && (
                  <MotiView
                    key="rolling-label"
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Text style={[styles.rollingLabel, { color: colors.textMuted }]}>{t('diceGame.rolling')}</Text>
                  </MotiView>
                )}

                {mode === 'practice' && currentCat && (
                  <MotiView
                    key="category-title"
                    from={{ opacity: 0, translateY: -40, scale: 1.2 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 50 }}
                    style={styles.categoryBadge}
                  >
                    <DiceCategoryIcon faceId={currentItem?.faceId ?? 1} size={24} />
                    <Text style={styles.categoryBadgeText}>{currentCatName}</Text>
                    <Text style={styles.categoryBadgeCount}>#{rollCount}</Text>
                  </MotiView>
                )}

                {mode === 'practice' && previewCard && (
                  <Pressable
                    onPress={() => setShowCardPreview(true)}
                    style={[styles.cardPreviewBtn, { backgroundColor: previewCard.border }]}
                  >
                    <View style={styles.cardPreviewDot} />
                    <Text style={styles.cardPreviewText} numberOfLines={1}>{previewCard.text}</Text>
                    <ChevronRight size={14} color="rgba(255,255,255,0.7)" />
                  </Pressable>
                )}
              </View>

              {mode === 'practice' && currentItem && currentCat && (
                <MotiView
                  key="practice-content"
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 300 }}
                  style={styles.flex1}
                >
                    <View style={[styles.practiceCard, { borderColor: currentCat.border }]}>
                      <Text style={[styles.practiceText, { color: colors.textPrimary }]}>{currentItem.text}</Text>
                    </View>

                    {isSolo ? (
                      <View style={styles.actions}>
                        <Button onPress={reroll} fullWidth icon={<Dices size={18} color="#fff" />}>{t('diceGame.newRoll')}</Button>
                        <Button onPress={reset} variant="secondary" fullWidth icon={<RotateCcw size={16} color="#fff" />}>{t('diceGame.changeMode')}</Button>
                        <Button onPress={handleQuit} variant="ghost" fullWidth>{t('diceGame.quit')}</Button>
                      </View>
                    ) : (
                      <View style={styles.duoVoteStart}>
                        <Text style={[styles.readVoteLabel, { color: colors.textMuted }]}>{t('diceGame.readVote')}</Text>
                        <Button onPress={() => setMode('duo-p1')} fullWidth icon={<Users size={18} color="#fff" />}>
                          {`${t('diceGame.startVote')}`}
                        </Button>
                      </View>
                    )}
                </MotiView>
              )}
            </MotiView>
          )}

          {/* DUO P1 */}
          {mode === 'duo-p1' && currentItem && currentCat && (
            <MotiView
              key="duo-p1"
              from={{ opacity: 0, translateX: 30 }}
              animate={{ opacity: 1, translateX: 0 }}
              style={styles.flex1}
            >
              <View style={styles.personHeader}>
                <View style={styles.personBadgeAmber}>
                  <Text style={styles.personBadgeNum}>1</Text>
                </View>
                <Text style={[styles.personLabel, { color: colors.textPrimary }]}>{t('diceGame.person1')}</Text>
              </View>
              <View style={[styles.catCard]}>
                <DiceCategoryIcon faceId={currentItem.faceId} size={32} />
                <Text style={styles.catCardName}>{currentCatName}</Text>
              </View>
              <View style={[styles.textCard, { backgroundColor: colors.bgSecondary }]}>
                <Text style={[styles.textCardContent, { color: colors.textSecondary }]}>{currentItem.text}</Text>
              </View>
              <Text style={[styles.questionLabel, { color: colors.textPrimary }]}>{t('diceGame.areYouIn')}</Text>
              <Text style={[styles.noteLabel, { color: colors.textMuted }]}>{t('diceGame.hideNote')}</Text>
              <View style={styles.voteRow}>
                <Pressable
                  onPress={() => { setP1Answer('no'); setMode('duo-hidden'); }}
                  style={[styles.voteBtn, styles.voteBtnNo]}
                >
                  <X size={24} color="#ef4444" />
                  <Text style={styles.voteNo}>{t('diceGame.no')}</Text>
                  <Text style={styles.voteNoNote}>{t('diceGame.noNote')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => { setP1Answer('yes'); setMode('duo-hidden'); }}
                  style={[styles.voteBtn, styles.voteBtnYes]}
                >
                  <Check size={24} color="#22c55e" />
                  <Text style={styles.voteYes}>{t('diceGame.yes')}</Text>
                  <Text style={styles.voteYesNote}>{t('diceGame.yesNote')}</Text>
                </Pressable>
              </View>
            </MotiView>
          )}

          {/* ÉCRAN RIDEAU */}
          {mode === 'duo-hidden' && (
            <MotiView
              key="duo-hidden"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.hiddenScreen}
            >
              <MotiView
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ type: 'timing', duration: 1500, loop: true }}
                style={[styles.hiddenIcon, { backgroundColor: colors.bgSecondary }]}
              >
                <EyeOff size={36} color={colors.textMuted} />
              </MotiView>
              <Text style={[styles.hiddenTitle, { color: colors.textPrimary }]}>{t('diceGame.recorded')}</Text>
              <Text style={[styles.hiddenSub, { color: colors.textMuted }]}>{t('diceGame.passPhone')}</Text>
              <Button onPress={() => setMode('duo-p2')} icon={<Eye size={18} color="#fff" />}>
                {t('diceGame.person2Ready')}
              </Button>
            </MotiView>
          )}

          {/* DUO P2 */}
          {mode === 'duo-p2' && currentItem && currentCat && (
            <MotiView
              key="duo-p2"
              from={{ opacity: 0, translateX: 30 }}
              animate={{ opacity: 1, translateX: 0 }}
              style={styles.flex1}
            >
              <View style={styles.personHeader}>
                <View style={styles.personBadgeOrange}>
                  <Text style={styles.personBadgeNum}>2</Text>
                </View>
                <Text style={[styles.personLabel, { color: colors.textPrimary }]}>{t('diceGame.person2')}</Text>
              </View>
              <View style={styles.catCard}>
                <DiceCategoryIcon faceId={currentItem.faceId} size={32} />
                <Text style={styles.catCardName}>{currentCatName}</Text>
              </View>
              <View style={[styles.textCard, { backgroundColor: colors.bgSecondary }]}>
                <Text style={[styles.textCardContent, { color: colors.textSecondary }]}>{currentItem.text}</Text>
              </View>
              <Text style={[styles.questionLabel, { color: colors.textPrimary }]}>{t('diceGame.areYouIn')}</Text>
              <Text style={[styles.noteLabel, { color: colors.textMuted }]}>{t('diceGame.honestNote')}</Text>
              <View style={styles.voteRow}>
                <Pressable
                  onPress={() => { setP2Answer('no'); setMode('duo-reveal'); }}
                  style={[styles.voteBtn, styles.voteBtnNo]}
                >
                  <X size={24} color="#ef4444" />
                  <Text style={styles.voteNo}>{t('diceGame.no')}</Text>
                  <Text style={styles.voteNoNote}>{t('diceGame.noNote')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => { setP2Answer('yes'); setMode('duo-reveal'); }}
                  style={[styles.voteBtn, styles.voteBtnYes]}
                >
                  <Check size={24} color="#22c55e" />
                  <Text style={styles.voteYes}>{t('diceGame.yes')}</Text>
                  <Text style={styles.voteYesNote}>{t('diceGame.yesNote')}</Text>
                </Pressable>
              </View>
            </MotiView>
          )}

          {/* RÉVÉLATION */}
          {mode === 'duo-reveal' && currentCat && (
            <MotiView
              key="duo-reveal"
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.revealContainer}
            >
              <GameEndCinematic
                primaryColor={bothYes ? colors.success : colors.textMuted}
                secondaryColor={bothYes ? colors.accentLight : colors.textSecondary}
                intensity={bothYes ? 'high' : 'low'}
              />
              <View style={styles.revealContent}>
                <MotiView
                  from={{ scale: 0, rotate: '-15deg' }}
                  animate={{ scale: 1, rotate: '0deg' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 100 }}
                  style={styles.revealIcon}
                >
                  {bothYes
                    ? <PartyPopper size={52} color="#4ade80" />
                    : <Handshake size={52} color="#94a3b8" />
                  }
                </MotiView>

                <Text style={[styles.revealTitle, { color: colors.textPrimary }]}>
                  {bothYes ? t('diceGame.bothYes') : t('diceGame.notThisTime')}
                </Text>
                <Text style={[styles.revealSub, { color: colors.textMuted }]}>
                  {bothYes ? t('diceGame.bothYesSub', { cat: currentCatName }) : t('diceGame.notThisTimeSub')}
                </Text>

                {!bothYes && (
                  <MotiView
                    from={{ opacity: 0, translateY: 8 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 400 }}
                    style={styles.anonymityBox}
                  >
                    <Text style={styles.anonymityText}>{t('diceGame.anonymity')}</Text>
                  </MotiView>
                )}

                <View style={styles.revealActions}>
                  <Button onPress={reroll} fullWidth icon={<Dices size={18} color="#fff" />}>{t('diceGame.newRoll')}</Button>
                  <Button onPress={reset} variant="secondary" fullWidth icon={<RotateCcw size={16} color="#fff" />}>{t('diceGame.changeMode')}</Button>
                  <Button onPress={handleQuit} variant="ghost" fullWidth>{t('diceGame.quit')}</Button>
                </View>
              </View>
            </MotiView>
          )}

        </>
      </MotiView>

      {showCardPreview && previewCard && (
        <CardFullscreenOverlay
          card={previewCard}
          onClose={() => setShowCardPreview(false)}
        />
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 13,
  },
  diceCenter: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  modeList: {
    gap: 12,
    marginBottom: 32,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    gap: 16,
  },
  modeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    flex: 1,
  },
  modeTitle: {
    fontWeight: '700',
    fontSize: 15,
  },
  modeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  categoriesSection: {
    marginTop: 'auto',
  } as object,
  categoriesLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  categoryChip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  categoryChipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  diceArea: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  rollingLabel: {
    marginTop: 16,
    fontSize: 14,
  },
  categoryBadge: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245,158,11,0.9)',
  },
  categoryBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: -0.5,
  },
  categoryBadgeCount: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardPreviewBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardPreviewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cardPreviewText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  practiceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  practiceText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
  } as object,
  duoVoteStart: {
    marginTop: 'auto',
  } as object,
  readVoteLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  personBadgeAmber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personBadgeOrange: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personBadgeNum: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  personLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  catCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.9)',
    gap: 4,
  },
  catCardName: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 17,
    marginTop: 4,
  },
  textCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  textCardContent: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  questionLabel: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
  },
  voteRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  } as object,
  voteBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  voteBtnNo: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  voteBtnYes: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  voteNo: {
    fontWeight: '700',
    color: '#dc2626',
    fontSize: 14,
  },
  voteNoNote: {
    fontSize: 12,
    color: '#f87171',
  },
  voteYes: {
    fontWeight: '700',
    color: '#16a34a',
    fontSize: 14,
  },
  voteYesNote: {
    fontSize: 12,
    color: '#4ade80',
  },
  hiddenScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  hiddenTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  hiddenSub: {
    fontSize: 14,
    maxWidth: 280,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  revealContainer: {
    flex: 1,
    position: 'relative',
  },
  revealContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  revealIcon: {
    marginBottom: 16,
  },
  revealTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  revealSub: {
    fontSize: 14,
    maxWidth: 280,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  anonymityBox: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    maxWidth: 280,
  },
  anonymityText: {
    fontSize: 12,
    color: '#1d4ed8',
    textAlign: 'center',
  },
  revealActions: {
    gap: 12,
    width: '100%',
    maxWidth: 320,
    marginTop: 24,
  },
});
