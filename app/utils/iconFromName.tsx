'use client';
import {
  Heart, Flame, ShieldCheck, Sparkles, MessageCircle,
  Handshake, Moon, Clock, Zap, Lightbulb, Eye, EyeOff, Compass, MessageSquare,
  Link2, Layers, Crown, Gift, PhoneOff, XCircle, Pause, HelpCircle, CheckCircle,
  Star, Flag, Rocket, Film, Scale, AlertTriangle, ShieldAlert, AlertCircle,
  Users, Smartphone, BellOff, LifeBuoy, Calendar, Target, Shield, Dices, Smile,
  Lock, Waves, Leaf, Wind, Dice5, Hand, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Flame, ShieldCheck, Sparkles, MessageCircle,
  Handshake, Moon, Clock, Zap, Lightbulb, Eye, EyeOff, Compass, MessageSquare,
  Link2, Layers, Crown, Gift, PhoneOff, XCircle, Pause, HelpCircle, CheckCircle,
  Star, Flag, Rocket, Film, Scale, AlertTriangle, ShieldAlert, AlertCircle,
  Users, Smartphone, BellOff, LifeBuoy, Calendar, Target, Shield, Dices, Smile,
  Lock, Waves, Leaf, Wind, Dice5, Hand,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export function DynamicIcon({ name, size = 20, className, color }: DynamicIconProps) {
  const Icon = ICON_MAP[name] ?? Heart;
  return <Icon size={size} className={className} color={color} />;
}
