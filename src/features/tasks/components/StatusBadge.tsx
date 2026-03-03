import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { icon: typeof Circle; label: string; colorVar: string; bgVar: string }> = {
  todo: { icon: Circle, label: 'Todo', colorVar: 'var(--status-todo)', bgVar: 'var(--status-todo-bg)' },
  in_progress: { icon: Clock, label: 'In Progress', colorVar: 'var(--status-progress)', bgVar: 'var(--status-progress-bg)' },
  finished: { icon: CheckCircle2, label: 'Done', colorVar: 'var(--status-done)', bgVar: 'var(--status-done-bg)' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.todo;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-medium transition-colors duration-150",
        className
      )}
      style={{
        backgroundColor: config.bgVar,
        color: config.colorVar,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
