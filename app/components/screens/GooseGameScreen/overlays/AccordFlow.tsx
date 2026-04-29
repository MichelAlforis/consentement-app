'use client';
import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, EyeOff, Sparkles, Smile, Handshake } from 'lucide-react';
import { DynamicIcon } from '../../../../utils/iconFromName';
import { Overlay } from '../components/Overlay';
import { Player, TurnStep } from '../types';
import { useTranslation } from '../../../../i18n';
import { useUnlockStore } from '../../../../stores';
import { sampleRandomCard } from '../../../../lib/sampleCard';
import type { GainedCard } from '../../../../lib/computeGainedCards';
import { CollectorCardCanvas } from '../../../../game-engine/cards/CollectorCardCanvas';

type AccordStep = Extract<TurnStep, 'accord-intro' | 'accord-p1' | 'accord-hidden' | 'accord-p2' | 'accord-result'>;

interface AccordFlowProps {
  step: AccordStep;
  activity: string;
  player1: Player;
  player2: Player;
  accordVote0: boolean | null;
  accordVote1: boolean | null;
  accordsCount: number;
  onIntroNext: () => void;
  onP1Vote: (v: boolean) => void;
  onP2Ready: () => void;
  onP2Vote: (v: boolean) => void;
  onResult: (bothYes: boolean) => void;
}

export function AccordFlow({
  step, activity, player1, player2,
  accordVote0, accordVote1, accordsCount,
  onIntroNext, onP1Vote, onP2Ready, onP2Vote, onResult,
}: AccordFlowProps) {
  const { t } = useTranslation();
  const bothYes = accordVote0 === true && accordVote1 === true;
  const ownedCards = useUnlockStore((s) => s.ownedCards);

  const previewCard = useMemo((): GainedCard | null => {
    if (!bothYes) return null;
    return sampleRandomCard(ownedCards);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bothYes]);

  return (
    <AnimatePresence mode="wait">

      {step === 'accord-intro' && (
        <Overlay key="acc-intro" color="linear-gradient(160deg, #1d4ed8, #1e40af)">
          <div className="text-center mb-5">
            <div className="flex justify-center mb-2"><Handshake size={40} /></div>
            <h3 className="text-white text-xl font-black">{t('gooseGame.accord.title')}</h3>
            <p className="text-white/65 text-sm mt-1">{t('gooseGame.accord.sub')}</p>
          </div>
          <div className="rounded-2xl p-4 mb-6 bg-white/10">
            <p className="text-white text-base font-semibold leading-[1.55]">{activity}</p>
          </div>
          <button
            onClick={onIntroNext}
            className="w-full py-4 rounded-2xl font-bold text-base bg-white/95 text-[#1d4ed8]"
          >
            {t('gooseGame.accord.voteSecret')}
          </button>
        </Overlay>
      )}

      {step === 'accord-p1' && (
        <Overlay key="acc-p1" color="#0f172a">
          <div className="text-center mb-4">
            <div className="flex justify-center"><DynamicIcon name={player1.pawn} size={32} color="white" /></div>
            <p className="text-white font-bold mt-1">{t('gooseGame.accord.yourVote', { name: player1.name })}</p>
            <p className="text-white/45 text-xs mt-0.5">{t('gooseGame.accord.noSee')}</p>
          </div>
          <p className="text-white/75 text-sm text-center mb-7 leading-relaxed">{activity}</p>
          <VoteButtons onVote={onP1Vote} />
        </Overlay>
      )}

      {step === 'accord-hidden' && (
        <Overlay key="acc-hidden" color="#060912">
          <div className="text-center py-6">
            <div className="flex justify-center mb-4"><EyeOff size={48} className="text-white/60" /></div>
            <h3 className="text-white text-xl font-bold mb-2">
              {t('gooseGame.accord.passPhone', { name: player2.name })}
            </h3>
            <p className="text-white/40 text-sm mb-8">
              {t('gooseGame.accord.voted', { name: player1.name })}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onP2Ready}
              className="w-full py-4 rounded-2xl font-bold text-base bg-white/[0.12] text-white border-[1.5px] border-white/[0.22]"
            >
              {t('gooseGame.accord.ready', { name: player2.name })}
            </motion.button>
          </div>
        </Overlay>
      )}

      {step === 'accord-p2' && (
        <Overlay key="acc-p2" color="#0f172a">
          <div className="text-center mb-4">
            <div className="flex justify-center"><DynamicIcon name={player2.pawn} size={32} color="white" /></div>
            <p className="text-white font-bold mt-1">{t('gooseGame.accord.yourVote', { name: player2.name })}</p>
            <p className="text-white/45 text-xs mt-0.5">{t('gooseGame.accord.voteWithout', { name: player1.name })}</p>
          </div>
          <p className="text-white/75 text-sm text-center mb-7 leading-relaxed">{activity}</p>
          <VoteButtons onVote={onP2Vote} />
        </Overlay>
      )}

      {step === 'accord-result' && (
        <Overlay
          key="acc-result"
          color={bothYes
            ? 'linear-gradient(160deg, #14532d, #15803d)'
            : 'linear-gradient(160deg, #1e293b, #334155)'}
        >
          <div className="text-center py-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="flex justify-center mb-3"
            >
              {bothYes ? <Sparkles size={48} /> : <Smile size={48} />}
            </motion.div>
            <h3 className="text-white text-xl font-black mb-2">
              {bothYes ? t('gooseGame.accord.success') : t('gooseGame.accord.noWorry')}
            </h3>
            {bothYes ? (
              <>
                <p className="text-white/70 text-sm mb-2 flex items-center justify-center gap-2">
                  <Check size={14} className="text-green-400 shrink-0" />
                  {t('gooseGame.accord.bothYesPlayers', { p1: player1.name, p2: player2.name })}
                  <Check size={14} className="text-green-400 shrink-0" />
                </p>
                <p className="text-white/55 text-sm mb-4">
                  {t('gooseGame.accord.accordNum', { count: accordsCount + 1 })}
                </p>
                {previewCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', stiffness: 240, damping: 20 }}
                    className="flex justify-center mb-5"
                  >
                    <CollectorCardCanvas card={previewCard} isFlipped={false} autoFlip size={120} />
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <p className="text-white/60 text-sm mb-2">
                  {t('gooseGame.accord.noSaid')}
                </p>
                <p className="text-white/40 text-xs mb-7">{t('gooseGame.accord.noRecule')}</p>
              </>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onResult(bothYes)}
              className="w-full py-4 rounded-2xl font-bold text-base bg-white/95 text-[#1e293b]"
            >
              {t('gooseGame.accord.continueBtn')}
            </motion.button>
          </div>
        </Overlay>
      )}

    </AnimatePresence>
  );
}

function VoteButtons({ onVote }: { onVote: (v: boolean) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      <motion.button whileTap={{ scale: 0.93 }} onClick={() => onVote(false)}
        className="flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-red-500/[0.18] text-red-300 border-[1.5px] border-red-500/35">
        <X size={18} />
        {t('gooseGame.accord.no')}
      </motion.button>
      <motion.button whileTap={{ scale: 0.93 }} onClick={() => onVote(true)}
        className="flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-green-500/[0.18] text-green-300 border-[1.5px] border-green-500/35">
        <Check size={18} />
        {t('gooseGame.accord.yes')}
      </motion.button>
    </div>
  );
}
