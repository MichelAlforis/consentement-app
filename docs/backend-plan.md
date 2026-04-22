# Plan Backend — Supabase

## Décision d'architecture

**Stack** : Supabase (PostgreSQL + Auth + Realtime + RLS)

**Pourquoi Supabase :**
- Auth natif (email/anon/OAuth) → remplace le login local immédiatement
- Realtime → sync duo en temps réel via subscriptions
- Row Level Security → données privées par utilisateur sans serveur custom
- SDK TypeScript → compatible avec les stores Zustand existants
- Scale : 500MB free, puis usage-based
- Migration facile : les stores Zustand actuels ont le bon contrat

---

## Schéma de base de données

```sql
-- ── Utilisateurs ─────────────────────────────────────────────────────────────
-- Géré par Supabase Auth (auth.users)
-- Extension : table publique liée à auth.users

create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text not null,
  age_group   text check (age_group in ('minor', 'adult')) not null,
  language    text default 'fr',
  theme_mode  text default null,
  is_premium  boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Profils de confort ────────────────────────────────────────────────────────
create table public.comfort_profiles (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade unique,
  tenderness  jsonb default '{}',
  intensity   jsonb default '{}',
  trust       jsonb default '{}',
  safeword    text default '',
  updated_at  timestamptz default now()
);

-- ── Sessions Duo ──────────────────────────────────────────────────────────────
create table public.duo_sessions (
  id              uuid default gen_random_uuid() primary key,
  code            text unique not null,  -- code à 6 chiffres
  user_a_id       uuid references public.profiles(id),
  user_b_id       uuid references public.profiles(id),
  status          text default 'pending' check (status in ('pending', 'connected', 'completed', 'expired')),
  current_step    text default 'choice',
  pact_a          boolean default false,
  pact_b          boolean default false,
  profile_a_done  boolean default false,
  profile_b_done  boolean default false,
  ready_a         boolean default false,
  ready_b         boolean default false,
  revealed_cats   text[] default '{}',
  expires_at      timestamptz default (now() + interval '2 hours'),
  created_at      timestamptz default now()
);
```

---

## Row Level Security

```sql
-- Profiles : chaque user voit/modifie uniquement le sien
alter table public.profiles enable row level security;
create policy "Own profile" on public.profiles
  using (auth.uid() = id);

-- Comfort profiles
alter table public.comfort_profiles enable row level security;
create policy "Own comfort" on public.comfort_profiles
  using (auth.uid() = user_id);

-- Duo sessions : visible uniquement par les participants
alter table public.duo_sessions enable row level security;
create policy "Session participants" on public.duo_sessions
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);
```

---

## Migration des stores Zustand

Quand Supabase est intégré, chaque store remplace sa persistance localStorage par des appels API :

### useAuthStore
```ts
// Avant
set({ isAuthenticated: true, userName: name });

// Après
const { data } = await supabase.auth.signInWithPassword({ email, password });
set({ isAuthenticated: true, userName: data.user.email });
```

### useProfileStore
```ts
// Avant
setStoredValue(STORAGE_KEYS.profile, newProfile);

// Après
await supabase.from('comfort_profiles').upsert({ user_id: userId, ...newProfile });
```

### useDuoStore — connectDuo (realtime)
```ts
// Avant (mock local)
set({ duoConnected: true, partnerProfile: generatePartnerProfile() });

// Après (realtime Supabase)
const channel = supabase.channel(`duo:${code}`)
  .on('postgres_changes', { event: 'UPDATE', table: 'duo_sessions' }, (payload) => {
    set({ currentStep: payload.new.current_step });
  })
  .subscribe();
```

---

## Variables d'environnement à ajouter

Dans `.env.local` (voir `.env.example`) :
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Ordre d'implémentation (quand prêt)

1. Créer projet Supabase + appliquer le schéma SQL
2. `npm install @supabase/supabase-js`
3. Créer `app/lib/supabase.ts` (client singleton)
4. Migrer `useAuthStore` → Supabase Auth
5. Migrer `useProfileStore` → table `comfort_profiles`
6. Migrer `useSettingsStore` → colonnes dans `profiles`
7. Implémenter sync duo realtime via `duo_sessions` + subscriptions
8. Migrer `usePremiumStore` → colonne `is_premium` dans `profiles`

---

## Estimation effort

| Tâche | Effort |
|---|---|
| Setup Supabase + schéma | 2h |
| Auth migration | 4h |
| Profile migration | 3h |
| Settings migration | 1h |
| Duo realtime | 8h |
| Tests intégration | 4h |
| **Total** | **~22h** |
