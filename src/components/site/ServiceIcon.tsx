import {
  Sparkles, Sun, Droplet, Scissors, Layers, Star, Shield, Activity, Hand, Wand2,
  User, Zap, ShieldAlert, Search, Eye, AlertCircle, Trash2,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Sparkles, Sun, Droplet, Scissors, Layers, Star, Shield, Activity, Hand, Wand2,
  User, Zap, ShieldAlert, Search, Eye, AlertCircle, Trash2,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Sparkles;
  return <Icon className={className} />;
}