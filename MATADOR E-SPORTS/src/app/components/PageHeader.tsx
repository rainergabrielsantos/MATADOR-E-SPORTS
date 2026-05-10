import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  action?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = "Back",
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[#a8b2bf] hover:text-white text-sm mb-4 transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          {backLabel}
        </Link>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl text-white font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-[#a8b2bf] text-lg">{subtitle}</p>
          )}
        </div>
        {action && <div className="mt-1">{action}</div>}
      </div>
    </div>
  );
}
