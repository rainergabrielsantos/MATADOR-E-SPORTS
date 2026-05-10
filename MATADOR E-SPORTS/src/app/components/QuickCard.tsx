import { type LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface QuickCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  metric?: string;
  metricLabel?: string;
  ctaLabel: string;
  to: string;
  accentColor?: string;
}

export function QuickCard({
  icon: Icon,
  title,
  subtitle,
  metric,
  metricLabel,
  ctaLabel,
  to,
  accentColor = "#CE1126",
}: QuickCardProps) {
  return (
    <Link to={to} className="group block">
      <div
        className="bg-[#0d0d12] border border-white/10 rounded-xl p-6 h-full flex flex-col hover:border-[#CE1126]/50 transition-all duration-200"
        style={{ "--accent": accentColor } as React.CSSProperties}
      >
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-3 rounded-lg transition-all duration-200"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-[#a8b2bf] text-xs">{subtitle}</p>
          </div>
        </div>

        {/* Key Metric */}
        {metric && (
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: accentColor }}>
                {metric}
              </p>
              {metricLabel && (
                <p className="text-[#a8b2bf] text-xs mt-1">{metricLabel}</p>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
            {ctaLabel} →
          </span>
          <div
            className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
    </Link>
  );
}
