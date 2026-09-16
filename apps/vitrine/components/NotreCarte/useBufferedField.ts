import { useEffect, useRef } from 'react';

const FLUSH_DELAY = 200;

/**
 * Un champ contrôlé par React (value + onChange) réécrit sa valeur sur le DOM à
 * chaque rendu. Sur iOS Safari, cette réécriture entre en conflit avec la
 * correction automatique et les suggestions du clavier : une lettre tapée
 * s'affiche puis disparaît, un mot suggéré ne s'insère pas. La solution, c'est
 * de laisser le DOM posséder sa propre valeur (champ non contrôlé) et de ne la
 * resynchroniser depuis l'extérieur (sauvegarde, fusion temps réel) que de façon
 * impérative, jamais via `value=`.
 */
export function useUncontrolledField<T extends HTMLInputElement | HTMLTextAreaElement>(
  value: string,
  onChange?: (v: string) => void,
  onSync?: () => void
) {
  const ref = useRef<T | null>(null);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Tant que le champ a le focus, rien venant de l'extérieur (sauvegarde, écho
  // temps réel) ne doit pouvoir toucher sa valeur — sinon une réponse arrivée
  // après la fin d'une pause de frappe (mais pendant qu'on retape déjà) peut
  // écraser une lettre en cours, donnant l'impression qu'elle a été effacée.
  useEffect(() => {
    const el = ref.current;
    if (!el || pending.current || document.activeElement === el) return;
    if (el.value !== value) {
      el.value = value;
      onSync?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flush = (v: string) => {
    clearTimeout(timer.current);
    pending.current = false;
    onChange?.(v);
  };

  const onInput = (e: React.FormEvent<T>) => {
    const v = e.currentTarget.value;
    pending.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => flush(v), FLUSH_DELAY);
    onSync?.();
  };

  const onBlur = () => {
    const el = ref.current;
    if (el) flush(el.value);
  };

  return { ref, onInput, onBlur };
}
