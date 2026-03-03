import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

const priorityConfig: Record<string, { icon: typeof ArrowUp; label: string; colorVar: string }> = {
  low: { icon: ArrowDown, label: 'Low', colorVar: 'var(--priority-low)' },
  medium: { icon: ArrowRight, label: 'Medium', colorVar: 'var(--priority-medium)' },
  high: { icon: ArrowUp, label: 'High', colorVar: 'var(--priority-high)' },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] font-medium",
        className
      )}
      style={{ color: config.colorVar }}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
