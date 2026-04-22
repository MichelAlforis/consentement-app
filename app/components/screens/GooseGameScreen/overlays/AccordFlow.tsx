'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Overlay } from '../components/Overlay';
import { Player, TurnStep } from '../types';
import { useTranslation } from '../../../../i18n';

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

  return (
    <AnimatePresence mode="wait">

      {step === 'accord-intro' && (
        <Overlay key="acc-intro" color="linear-gradient(160deg, #1d4ed8, #1e40af)">
          <div className="text-center mb-5">
            <div className="text-4xl mb-2">🤝</div>
            <h3 className="text-white text-xl font-black">{t('gooseGame.accord.title')}</h3>
            <p className="text-white/65 text-sm mt-1">{t('gooseGame.accord.sub')}</p>
          </div>
          <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <p className="text-white text-base font-semibold" style={{ lineHeight: 1.55 }}>{activity}</p>
          </div>
          <button
            onClick={onIntroNext}
            className="w-full py-4 rounded-2xl font-bold text-base"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#1d4ed8' }}
          >
            {t('gooseGame.accord.voteSecret')}
          </button>
        </Overlay>
      )}

      {step === 'accord-p1' && (
        <Overlay key="acc-p1" color="#0f172a">
          <div className="text-center mb-4">
            <span className="text-3xl">{player1.emoji}</span>
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
            <div className="text-5xl mb-4">🙈</div>
            <h3 className="text-white text-xl font-bold mb-2">
              {t('gooseGame.accord.passPhone', { name: player2.name })}
            </h3>
            <p className="text-white/40 text-sm mb-8">
              {t('gooseGame.accord.voted', { name: player1.name })}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onP2Ready}
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.22)' }}
            >
              {t('gooseGame.accord.ready', { name: player2.name })}
            </motion.button>
          </div>
        </Overlay>
      )}

      {step === 'accord-p2' && (
        <Overlay key="acc-p2" color="#0f172a">
          <div className="text-center mb-4">
            <span className="text-3xl">{player2.emoji}</span>
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
              className="text-5xl mb-3"
            >
              {bothYes ? '🎉' : '🤗'}
            </motion.div>
            <h3 className="text-white text-xl font-black mb-2">
              {bothYes ? t('gooseGame.accord.success') : t('gooseGame.accord.noWorry')}
            </h3>
            {bothYes ? (
              <>
                <p className="text-white/70 text-sm mb-2">
                  {t('gooseGame.accord.bothYesPlayers', { p1: player1.name, p2: player2.name })}
                </p>
                <p className="text-white/55 text-sm mb-7">
                  {t('gooseGame.accord.accordNum', { count: accordsCount + 1 })}
                </p>
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
              className="w-full py-4 rounded-2xl font-bold text-base"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b' }}
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
        className="flex-1 py-4 rounded-2xl font-bold text-lg"
        style={{ background: 'rgba(239,68,68,0.18)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.35)' }}>
        {t('gooseGame.accord.no')}
      </motion.button>
      <motion.button whileTap={{ scale: 0.93 }} onClick={() => onVote(true)}
        className="flex-1 py-4 rounded-2xl font-bold text-lg"
        style={{ background: 'rgba(34,197,94,0.18)', color: '#86efac', border: '1.5px solid rgba(34,197,94,0.35)' }}>
        {t('gooseGame.accord.yes')}
      </motion.button>
    </div>
  );
}
