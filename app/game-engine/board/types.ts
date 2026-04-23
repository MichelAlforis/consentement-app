export type SquareKind = 'normal' | 'start' | 'end' | 'special';

export interface SquareConfig {
  id: string;
  kind: SquareKind;
  label: string;
  iconName: string;
  gradient: string;
  action?: 'activity' | 'bonus-move' | 'vote' | 'forced' | 'end';
  bonusMoves?: number;
  pool?: string;
}

export interface BoardLayout {
  columns: number;
  snake: boolean;
}

export interface BoardSquareInstance {
  index: number;
  configId: string;
  faceId?: number;
}

export interface BoardConfig {
  squares: BoardSquareInstance[];
  layout: BoardLayout;
  pawnEmojis: string[];
  maxPlayers?: number;
  saveKey?: string;
}

export interface ActivityPool {
  id: string;
  items: { id: string; text: string; tags?: string[] }[];
}

export interface BoardPlayerState {
  name: string;
  emoji: string;
  position: number;
}
