import { type LucideIcon } from "lucide-react";

interface StatPillProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  accentColor?: string;
  pulse?: boolean;
}

export function StatPill({
  icon: Icon,
  value,
  label,
  accentColor = "#CE1126",
  pulse = false,
}: StatPillProps) {
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
      <div className="relative">
        <Icon className="h-4 w-4" style={{ color: accentColor }} />
        {pulse && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>
      <span className="text-white font-semibold text-sm">{value}</span>
      <span className="text-[#a8b2bf] text-xs">{label}</span>
    </div>
  );
}
