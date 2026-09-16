import { useEffect, useRef, useState } from 'react';

const FLUSH_DELAY = 200;

/**
 * Écrire directement dans l'état global à chaque caractère force tout l'app à se
 * re-rendre à chaque frappe (historique, tendance, géométrie des flèches...) — invisible
 * sur desktop, mais ça se sent sur le clavier virtuel d'un iPhone. On tape dans un état
 * local instantané, et on ne répercute vers le global (et donc la sauvegarde) qu'après
 * une courte pause, ou immédiatement en quittant le champ.
 */
export function useBufferedField(value: string, onChange?: (v: string) => void) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pending = useRef(false);

  useEffect(() => {
    // Une frappe en cours ne doit jamais être écrasée par ce qui vient de l'extérieur
    // (sauvegarde, fusion temps réel) : on ne resynchronise que si rien n'est en attente.
    if (!pending.current) setLocal(value);
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flush = (v: string) => {
    clearTimeout(timer.current);
    pending.current = false;
    onChange?.(v);
  };

  const onLocalChange = (v: string) => {
    setLocal(v);
    pending.current = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => flush(v), FLUSH_DELAY);
  };

  const onBlur = () => flush(local);

  return { local, onLocalChange, onBlur };
}
