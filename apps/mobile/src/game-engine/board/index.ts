// BARREL — R7 : exports nominatifs, ne pas convertir en glob
export { useBoardEngine } from './useBoardEngine';
export type { BoardEngineState } from './useBoardEngine';
export { BoardRenderer } from './BoardRenderer.native';
export type { BoardRendererProps, LegendEntry } from './BoardRenderer.native';
export type {
  SquareKind,
  SquareConfig,
  BoardLayout,
  BoardSquareInstance,
  BoardConfig,
  ActivityPool,
  BoardPlayerState,
} from './types';
