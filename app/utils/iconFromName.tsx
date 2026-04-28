'use client';
import {
  Heart, Flame, ShieldCheck, Sparkles, MessageCircle,
  Handshake, Moon, Clock, Zap, Lightbulb, Eye, EyeOff, Compass, MessageSquare,
  Link2, Layers, Crown, Gift, PhoneOff, XCircle, Pause, HelpCircle, CheckCircle,
  Star, Flag, Rocket, Film, Scale, AlertTriangle, ShieldAlert, AlertCircle,
  Users, Smartphone, BellOff, LifeBuoy, Calendar, Target, Shield, Dices, Smile,
  Lock, Waves, Leaf, Wind, Dice5, Hand, type LucideIcon,
} from 'lucide-react';

export const ICON_MAP = {
  Heart, Flame, ShieldCheck, Sparkles, MessageCircle,
  Handshake, Moon, Clock, Zap, Lightbulb, Eye, EyeOff, Compass, MessageSquare,
  Link2, Layers, Crown, Gift, PhoneOff, XCircle, Pause, HelpCircle, CheckCircle,
  Star, Flag, Rocket, Film, Scale, AlertTriangle, ShieldAlert, AlertCircle,
  Users, Smartphone, BellOff, LifeBuoy, Calendar, Target, Shield, Dices, Smile,
  Lock, Waves, Leaf, Wind, Dice5, Hand,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_MAP;

interface DynamicIconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

export function DynamicIcon({ name, size = 20, className, color }: DynamicIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon size={size} className={className} color={color} />;
}
