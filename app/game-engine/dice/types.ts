import type { IconName } from '../../utils/iconFromName';

export interface DiceFace {
  /** Numéro de face (1–N). Doit correspondre à l'ordre dans DiceConfig.faces (faces[0].id === 1, etc.)
   *  et aux clés de FACE_ROTATIONS dans les renderers CSS 3D. */
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
