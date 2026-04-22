export type Phase = 'intro' | 'setup-p1' | 'setup-p2' | 'pacte' | 'playing' | 'end';

export type TurnStep =
  | 'roll'
  | 'rolling'
  | 'normal'
  | 'pause'
  | 'chance'
  | 'accord-intro'
  | 'accord-p1'
  | 'accord-hidden'
  | 'accord-p2'
  | 'accord-result'
  | 'complicite';

export interface Player {
  name: string;
  emoji: string;
}
