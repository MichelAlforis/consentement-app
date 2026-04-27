'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Video, X, ChevronRight, Phone, ExternalLink, Star, Shield } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { SEXOLOGUES, ALL_DEPARTEMENTS, type Sexologue } from '../../../data/sexologues';

interface AnnuaireSexologuesScreenProps {
  onBack: () => void;
}

// ── Filters ──────────────────────────────────────────────────────────────────

type ConsultFilter = 'tous' | 'présentiel' | 'téléconsultation';

function useFilters() {
  const [search, setSearch] = useState('');
  const [consult, setConsult] = useState<ConsultFilter>('tous');
  const [region, setRegion] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SEXOLOGUES.filter((s) => {
      const matchSearch =
        !q ||
        s.prenom.toLowerCase().includes(q) ||
        s.nom.toLowerCase().includes(q) ||
        s.ville.toLowerCase().includes(q) ||
        s.specialites.some((sp) => sp.toLowerCase().includes(q));
      const matchConsult =
        consult === 'tous' ||
        (consult === 'téléconsultation' && s.consultation !== 'présentiel') ||
        (consult === 'présentiel' && s.consultation !== 'téléconsultation');
      const matchRegion = !region || s.departement === region;
      return matchSearch && matchConsult && matchRegion;
    });
  }, [search, consult, region]);

  return { search, setSearch, consult, setConsult, region, setRegion, filtered };
}

// ── ProfileCard ───────────────────────────────────────────────────────────────

function LabelBadge({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
      style={{ background: colors.bgSecondary, color: colors.accent }}>
      {label}
    </span>
  );
}

function ProfileCard({ prof, onSelect }: { prof: Sexologue; onSelect: () => void }) {
  const { colors } = useTheme();
  const hasTele = prof.consultation !== 'présentiel';

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="w-full rounded-2xl p-4 text-left"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      {/* Nom + badges */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>
            {prof.prenom} {prof.nom}
          </span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {prof.labels.map((l) => <LabelBadge key={l} label={l} />)}
          </div>
        </div>
        {hasTele && (
          <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full shrink-0"
            style={{ background: `${colors.accent}18`, color: colors.accent }}>
            <Video size={10} />
            Téléconsultation
          </span>
        )}
      </div>

      {/* Titre */}
      <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>{prof.titre}</p>

      {/* Spécialités (3 max) */}
      <div className="flex flex-wrap gap-1 mb-3">
        {prof.specialites.slice(0, 3).map((sp) => (
          <span key={sp} className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: colors.bgSecondary, color: colors.textSecondary }}>
            {sp}
          </span>
        ))}
        {prof.specialites.length > 3 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: colors.bgSecondary, color: colors.textMuted }}>
            +{prof.specialites.length - 3}
          </span>
        )}
      </div>

      {/* Ville + tarif */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
          <MapPin size={11} />
          {prof.ville}
        </span>
        <span className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
          À partir de {prof.tarifSuivi}€
          {prof.remboursementSS && (
            <span className="ml-1 text-[10px] font-normal" style={{ color: colors.success }}>SS</span>
          )}
        </span>
      </div>
    </motion.button>
  );
}

// ── ProfileDetail ─────────────────────────────────────────────────────────────

function ProfileDetail({ prof, onClose }: { prof: Sexologue; onClose: () => void }) {
  const { colors } = useTheme();
  const hasTele = prof.consultation !== 'présentiel';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: colors.bgPrimary }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 shrink-0"
        style={{ borderBottom: `1px solid ${colors.border}` }}>
        <h2 className="font-bold text-base" style={{ color: colors.textPrimary }}>
          {prof.prenom} {prof.nom}
        </h2>
        <button onClick={onClose} className="p-2 rounded-xl" style={{ background: colors.bgSecondary }}>
          <X size={18} style={{ color: colors.textMuted }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {/* Titre + labels */}
        <div>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{prof.titre}</p>
          <div className="flex flex-wrap gap-1.5">
            {prof.labels.map((l) => (
              <span key={l} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${colors.accent}18`, color: colors.accent }}>
                <Shield size={11} />
                {l}
              </span>
            ))}
            {hasTele && (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: `${colors.success}18`, color: colors.success }}>
                <Video size={11} />
                Téléconsultation disponible
              </span>
            )}
          </div>
        </div>

        {/* Ville + langues */}
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: colors.textMuted }}>
          <span className="flex items-center gap-1"><MapPin size={12} />{prof.ville}</span>
          <span>{prof.langues.join(', ')}</span>
        </div>

        {/* Bio */}
        <div className="p-4 rounded-2xl" style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
          <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>{prof.bio}</p>
        </div>

        {/* Spécialités */}
        <Section title="Spécialités">
          <div className="flex flex-wrap gap-1.5">
            {prof.specialites.map((sp) => (
              <span key={sp} className="text-xs px-3 py-1 rounded-full"
                style={{ background: colors.bgSecondary, color: colors.textSecondary }}>
                {sp}
              </span>
            ))}
          </div>
        </Section>

        {/* Approches */}
        {prof.approches.length > 0 && (
          <Section title="Approches thérapeutiques">
            <div className="flex flex-wrap gap-1.5">
              {prof.approches.map((a) => (
                <span key={a} className="text-xs px-3 py-1 rounded-full"
                  style={{ background: `${colors.accent}12`, color: colors.accent }}>
                  {a}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Publics */}
        <Section title="Publics reçus">
          <p className="text-sm" style={{ color: colors.textSecondary }}>{prof.publics.join(' · ')}</p>
        </Section>

        {/* Tarifs */}
        <Section title="Tarifs">
          <div className="space-y-2">
            <TarifRow label="Première consultation" value={prof.tarifPremiere} duration={prof.dureeMinutes} />
            <TarifRow label="Séance de suivi" value={prof.tarifSuivi} duration={prof.dureeMinutes} />
            {prof.tarifCouple && <TarifRow label="Séance couple" value={prof.tarifCouple} duration={prof.dureeMinutes} />}
          </div>
          {prof.remboursementSS && (
            <p className="text-xs mt-2" style={{ color: colors.success }}>
              ✓ Remboursement partiel Sécurité Sociale possible (médecin secteur 2)
            </p>
          )}
          {!prof.remboursementSS && (
            <p className="text-xs mt-2" style={{ color: colors.textMuted }}>
              Non remboursé par la Sécurité Sociale. Vérifiez votre mutuelle.
            </p>
          )}
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <div className="space-y-2">
            <a href={`tel:${prof.telephone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-xl w-full"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <Phone size={16} style={{ color: colors.accent }} />
              <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{prof.telephone}</span>
            </a>
            {prof.doctolib && (
              <a href={prof.doctolib} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3 rounded-xl w-full"
                style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
                <div className="flex items-center gap-2">
                  <Star size={16} style={{ color: colors.rare }} />
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Prendre RDV sur Doctolib</span>
                </div>
                <ExternalLink size={14} style={{ color: colors.textMuted }} />
              </a>
            )}
          </div>
        </Section>

        <p className="text-xs text-center pb-4" style={{ color: colors.textMuted }}>
          Profil fictif — données à des fins de démonstration uniquement.
        </p>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: colors.textMuted }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function TarifRow({ label, value, duration }: { label: string; value: number; duration: number }) {
  const { colors } = useTheme();
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: colors.textSecondary }}>{label} ({duration} min)</span>
      <span className="font-semibold text-sm" style={{ color: colors.textPrimary }}>{value}€</span>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function AnnuaireSexologuesScreen({ onBack }: AnnuaireSexologuesScreenProps) {
  const { colors } = useTheme();
  const { search, setSearch, consult, setConsult, region, setRegion, filtered } = useFilters();
  const [selected, setSelected] = useState<Sexologue | null>(null);

  const consultFilters: { key: ConsultFilter; label: string }[] = [
    { key: 'tous', label: 'Tous' },
    { key: 'téléconsultation', label: 'Téléconsultation' },
    { key: 'présentiel', label: 'Présentiel' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-3 shrink-0">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}>
          <Search size={16} style={{ color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Rechercher par spécialité, ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: colors.textPrimary }}
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={14} style={{ color: colors.textMuted }} />
            </button>
          )}
        </div>

        {/* Consultation type filter */}
        <div className="flex gap-2">
          {consultFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setConsult(key)}
              className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{
                background: consult === key ? colors.accent : colors.bgCard,
                color: consult === key ? '#fff' : colors.textSecondary,
                border: `1px solid ${consult === key ? colors.accent : colors.border}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Region filter */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
          style={{
            background: colors.bgCard,
            color: region ? colors.textPrimary : colors.textMuted,
            border: `1px solid ${colors.border}`,
          }}
        >
          <option value="">Toutes les régions</option>
          {ALL_DEPARTEMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <p className="text-xs" style={{ color: colors.textMuted }}>
          {filtered.length} profil{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Aucun profil ne correspond à ta recherche.
              </p>
            </motion.div>
          ) : (
            filtered.map((prof) => (
              <ProfileCard key={prof.id} prof={prof} onSelect={() => setSelected(prof)} />
            ))
          )}
        </AnimatePresence>

        <div className="pt-2 pb-4">
          <p className="text-xs text-center" style={{ color: colors.textMuted }}>
            Profils fictifs — base de données à des fins de démonstration.{'\n'}
            Répertoires réels : snsc.fr · aius.fr · doctolib.fr/sexologie
          </p>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ProfileDetail prof={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
