'use client';

// Contenu à valider avec le juriste co-fondateur avant publication.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, ChevronRight, Phone, Shield, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';

interface AccompagnementAdulteScreenProps {
  onBack: () => void;
  onGoAnnuaire?: () => void;
}

type SituationType = 'victim' | 'self' | 'witness';
type Step = 'intro' | 'situation' | 'resources';

export function AccompagnementAdulteScreen({ onBack, onGoAnnuaire }: AccompagnementAdulteScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [step, setStep] = useState<Step>('intro');
  const [situation, setSituation] = useState<SituationType | null>(null);

  const selectSituation = (type: SituationType) => {
    setSituation(type);
    setStep('resources');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
          <HeartHandshake size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {t('accompagnementAdulte.title')}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {t('accompagnementAdulte.subtitle')}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl mb-5"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                {t('accompagnementAdulte.intro.text')}
              </p>
            </div>
            <p className="text-xs mb-5" style={{ color: colors.textMuted }}>
              {t('accompagnementAdulte.intro.note')}
            </p>
            <Button onClick={() => setStep('situation')} fullWidth>
              {t('accompagnementAdulte.intro.cta')}
              <ChevronRight size={18} />
            </Button>
            <Button onClick={onBack} variant="secondary" fullWidth className="mt-3">
              {t('nav.back')}
            </Button>
          </motion.div>
        )}

        {step === 'situation' && (
          <motion.div key="situation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-base font-semibold mb-5" style={{ color: colors.textPrimary }}>
              {t('accompagnementAdulte.situation.question')}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => selectSituation('victim')}
                className="w-full p-4 rounded-2xl text-left"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  {t('accompagnementAdulte.situation.victim.title')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  {t('accompagnementAdulte.situation.victim.desc')}
                </p>
              </button>
              <button
                onClick={() => selectSituation('self')}
                className="w-full p-4 rounded-2xl text-left"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  {t('accompagnementAdulte.situation.self.title')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  {t('accompagnementAdulte.situation.self.desc')}
                </p>
              </button>
              <button
                onClick={() => selectSituation('witness')}
                className="w-full p-4 rounded-2xl text-left"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
              >
                <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                  {t('accompagnementAdulte.situation.witness.title')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  {t('accompagnementAdulte.situation.witness.desc')}
                </p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'resources' && situation === 'victim' && (
          <motion.div key="victim" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl mb-5"
              style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                {t('accompagnementAdulte.victim.message')}
              </p>
            </div>
            <ResourceList resources={[
              { icon: <Phone size={18} className="text-white" />, bg: '#ec4899', label: t('accompagnementAdulte.resources.violences'), contact: '3919 — Gratuit, 24h/24, anonyme', tel: '3919' },
              { icon: <Shield size={18} className="text-white" />, bg: '#3b82f6', label: t('accompagnementAdulte.resources.police'), contact: '17 — Urgence', tel: '17' },
              { icon: <ExternalLink size={18} className="text-white" />, bg: '#6366f1', label: t('accompagnementAdulte.resources.signalement'), contact: 'signalement.gouv.fr', href: 'https://www.service-public.fr/particuliers/vosdroits/N31784' },
            ]} />
            <Button onClick={onBack} variant="secondary" fullWidth className="mt-5">
              {t('accompagnement.backHome')}
            </Button>
          </motion.div>
        )}

        {step === 'resources' && situation === 'self' && (
          <motion.div key="self" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl mb-5"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                {t('accompagnementAdulte.self.message')}
              </p>
            </div>
            <ResourceList resources={[
              { icon: <Phone size={18} className="text-white" />, bg: '#10b981', label: t('accompagnementAdulte.resources.planning'), contact: '0 800 08 11 11 — Gratuit, lun-sam', tel: '0800081111' },
              {
                icon: <HelpCircle size={18} className="text-white" />, bg: '#8b5cf6',
                label: t('accompagnementAdulte.resources.sexologue'),
                contact: 'Voir l\'annuaire dans l\'app',
                onPress: onGoAnnuaire,
              },
            ]} />
            <Button onClick={onBack} variant="secondary" fullWidth className="mt-5">
              {t('accompagnement.backHome')}
            </Button>
          </motion.div>
        )}

        {step === 'resources' && situation === 'witness' && (
          <motion.div key="witness" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="p-4 rounded-2xl mb-5"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                {t('accompagnementAdulte.witness.message')}
              </p>
            </div>
            <ResourceList resources={[
              { icon: <Phone size={18} className="text-white" />, bg: '#ec4899', label: t('accompagnementAdulte.resources.violences'), contact: '3919 — Gratuit, 24h/24, anonyme', tel: '3919' },
              { icon: <Shield size={18} className="text-white" />, bg: '#3b82f6', label: t('accompagnementAdulte.resources.police'), contact: '17 — Urgence', tel: '17' },
            ]} />
            <Button onClick={onBack} variant="secondary" fullWidth className="mt-5">
              {t('accompagnement.backHome')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type Resource = {
  icon: React.ReactNode;
  bg: string;
  label: string;
  contact: string;
  tel?: string;
  href?: string;
  onPress?: () => void;
};

function ResourceList({ resources }: { resources: Resource[] }) {
  const { colors } = useTheme();
  return (
    <div className="space-y-3">
      {resources.map((r, i) => {
        const inner = (
          <>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: r.bg }}>
              {r.icon}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{r.label}</p>
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>{r.contact}</p>
            </div>
          </>
        );
        const cls = "flex items-center gap-3 p-4 rounded-2xl w-full text-left";
        const style = { background: colors.bgCard, border: `1px solid ${colors.border}` };
        if (r.tel)
          return <a key={i} href={`tel:${r.tel}`} className={cls} style={style}>{inner}</a>;
        if (r.href)
          return <a key={i} href={r.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{inner}</a>;
        if (r.onPress)
          return <button key={i} onClick={r.onPress} className={cls} style={style}>{inner}</button>;
        return <div key={i} className={cls} style={style}>{inner}</div>;
      })}
    </div>
  );
}
