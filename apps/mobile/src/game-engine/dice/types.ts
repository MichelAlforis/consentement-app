import type { IconName } from '@ouiclair/core';

export interface DiceFace {
  /** Numéro de face (1–N). Doit correspondre à l'ordre dans DiceConfig.faces
   *  et aux clés de FACE_ROTATIONS dans DiceCanvas. */
  id: number;
  label: string;
  iconName: IconName | '';
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
