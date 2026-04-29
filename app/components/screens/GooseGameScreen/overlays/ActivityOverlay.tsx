'use client';
import { getSquareIconName, BoardSquare, ZONES } from '../../../../data/goose-game';
import { Zone } from '../../../../data/goose-game';
import { DynamicIcon } from '../../../../utils/iconFromName';
import { Overlay } from '../components/Overlay';
import { TurnStep } from '../types';
import { useTranslation } from '../../../../i18n';

interface ActivityOverlayProps {
  step: Extract<TurnStep, 'normal' | 'pause' | 'complicite'>;
  activity: string;
  activeName: string;
  currentSquare: BoardSquare;
  squareBg: string;
  currentZone: Zone;
  onContinue: () => void;
}

export function ActivityOverlay({
  step, activity, activeName, currentSquare, squareBg, currentZone, onContinue,
}: ActivityOverlayProps) {
  const { t } = useTranslation();
  const isPause      = step === 'pause';
  const isComplicite = step === 'complicite';
  const zoneNames = [t('gooseGame.end.zone1'), t('gooseGame.end.zone2'), t('gooseGame.end.zone3')];
  const zoneIdx = ZONES.indexOf(currentZone); // 0 | 1 | 2

  const iconName = isPause ? 'Pause' : isComplicite ? 'Heart' : getSquareIconName(currentSquare);
  const label = isPause
    ? t('gooseGame.activity.pause')
    : isComplicite
    ? t('gooseGame.activity.complicite')
    : (currentSquare.face ? t(`diceCategories.${currentSquare.face}`) : '');

  return (
    <Overlay key="activity" color={squareBg || '#1e293b'}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <DynamicIcon name={iconName} size={26} color="rgba(255,255,255,0.85)" />
          <div>
            <p className="text-white/55 text-xs uppercase tracking-widest font-bold">{label}</p>
            <p className="text-white font-bold text-sm">{activeName}</p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold rounded-[20px] px-2 py-[3px] bg-white/[0.12] flex items-center gap-1"
          style={{ color: currentZone.color, border: `1px solid ${currentZone.color}44` }}
        >
          <DynamicIcon name={currentZone.iconName} size={9} color={currentZone.color} /> {zoneNames[zoneIdx] ?? zoneNames[0]}
        </span>
      </div>

      <p className="text-white text-lg font-semibold mb-7 leading-[1.55]">
        {activity}
      </p>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-2xl font-bold text-base bg-white/[0.18] text-white border-[1.5px] border-white/35"
      >
        {t('gooseGame.activity.continueBtn')}
      </button>
    </Overlay>
  );
}
