import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 bg-white/5 rounded-full mb-4">
        <Icon className="h-8 w-8 text-[#a8b2bf]" />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-[#a8b2bf] text-sm max-w-xs">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
