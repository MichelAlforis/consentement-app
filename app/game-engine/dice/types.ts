export interface DiceFace {
  id: number;
  label: string;
  emoji: string;
  gradient: string;
  border: string;
  color: string;
}

export interface DiceConfig {
  faces: DiceFace[];
  size?: number;
  animationDuration?: number;
}

export interface DiceItem {
  id: string;
  faceId: number;
  text: string;
  tags?: string[];
}
