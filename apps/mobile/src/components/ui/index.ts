// BARREL — exports nominatifs uniquement. NE PAS convertir en "export * from".
// NE PAS supprimer d'exports existants. Seulement ajouter en fin de section.
// Règle R7 : chaque export doit être listé explicitement (voir docs/CONVENTIONS.md).

// Composants portés sessions précédentes
export { ComfortSlider } from './ComfortSlider';
export { Card } from './Card';
export { QRCode } from './QRCode';
export { LegalCredentialSheet } from './LegalCredentialSheet';
export { HeatRoadmapSheet } from './HeatRoadmapSheet';
export { AdBanner } from './AdBanner';
export { PositionSVG } from './PositionSVG';
export type { PositionSVGProps } from './PositionSVG';

// Phase 3 Agent 1 (commit bd112df)
export { AppLogo } from './AppLogo';
export { Button } from './Button';
export { Header } from './Header';
export { IconBox } from './IconBox';
export { TabBar } from './TabBar';
export { Toast } from './Toast';
export { ErrorBoundary } from './ErrorBoundary';
export { DailyQuestionCard } from './DailyQuestionCard';
export { MenuCard } from './MenuCard';
export { GameMenuCard } from './GameMenuCard';

// Phase 3 Agent 2 — composants moyens + overlays
export { CollectorCardFace, CardBack } from './CollectorCardFace';
export { GrainOverlay, ShimmerLayer, PreviewShimmer } from './ThemeEffects';
export { ExplicitModeToggle } from './ExplicitModeToggle';
export { HeatThermometer } from './HeatThermometer';
export { FlipRevealOverlay } from './FlipRevealOverlay';
export { PalierUpOverlay } from './PalierUpOverlay';
export { CardFullscreenOverlay } from './CardFullscreenOverlay';
export type { CardFullscreenOverlayProps } from './CardFullscreenOverlay';
