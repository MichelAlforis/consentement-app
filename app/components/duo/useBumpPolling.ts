'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { usePreferencesStore } from '../../stores/preferencesStore';
import type { PartnerProfile } from '../../types';

export type BumpState = 'searching' | 'detected' | 'timeout';

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 9; // ~45s

export function useBumpPolling(
  onSuccess: (partnerProfile: PartnerProfile, sessionId: string) => void,
  onTimeout: () => void,
) {
  const [bumpState, setBumpState] = useState<BumpState>('searching');
  const [retryKey, setRetryKey] = useState(0);

  const pbUserId = useAuthStore((s) => s.pbUserId);
  const personalProfile = useProfileStore((s) => s.personalProfile);
  const preferences = usePreferencesStore((s) => s.answers);

  const onSuccessRef = useRef(onSuccess);
  const onTimeoutRef = useRef(onTimeout);
  const personalProfileRef = useRef(personalProfile);
  const preferencesRef = useRef(preferences);
  useEffect(() => { onSuccessRef.current = onSuccess; });
  useEffect(() => { onTimeoutRef.current = onTimeout; });
  useEffect(() => { personalProfileRef.current = personalProfile; });
  useEffect(() => { preferencesRef.current = preferences; });

  const retry = useCallback(() => {
    setBumpState('searching');
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!pbUserId) return;

    let cancelled = false;
    let attempts = 0;
    let activeUnsub: (() => void) | null = null;
    let hasCreatedSession = false;

    const poll = async () => {
      if (cancelled) return;
      if (attempts >= MAX_POLLS) {
        setBumpState('timeout');
        onTimeoutRef.current();
        return;
      }
      attempts++;

      const { getBumpCodes, createBumpSession, joinDuoSession, subscribeToSession } =
        await import('../../lib/sync/duoSync');

      const codes = getBumpCodes();
      const profile = personalProfileRef.current;
      const prefs = preferencesRef.current as Record<string, string>;

      for (const code of codes) {
        if (cancelled) return;
        try {
          const result = await joinDuoSession(code, profile, pbUserId, prefs);
          if (cancelled) return;
          setBumpState('detected');
          onSuccessRef.current(result.initiatorProfile, result.sessionId);
          return;
        } catch {
          // session not found — try next code
        }
      }

      // No existing session found — create one for current slot
      if (!hasCreatedSession && !cancelled) {
        hasCreatedSession = true;
        try {
          const { code, sessionId } = await createBumpSession(codes[0], profile, pbUserId, prefs);
          if (cancelled) return;
          activeUnsub = subscribeToSession(sessionId, code, (record) => {
            if (record.partner_profile && !cancelled) {
              setBumpState('detected');
              onSuccessRef.current(record.partner_profile, sessionId);
            }
          });
        } catch {
          // Code already exists (other device created it) — next poll will join
          hasCreatedSession = false;
        }
      }

      if (!cancelled) setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      activeUnsub?.();
    };
  // retryKey intentionally triggers a full restart of the polling loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbUserId, retryKey]);

  return { bumpState, retry, isOffline: !pbUserId };
}
