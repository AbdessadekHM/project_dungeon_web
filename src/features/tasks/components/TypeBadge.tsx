import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: string;
  className?: string;
}

const typeConfig: Record<string, { label: string; colorVar: string; bgVar: string; borderVar: string }> = {
  feature: { label: 'Feature', colorVar: 'var(--badge-feature-color)', bgVar: 'var(--badge-feature-bg)', borderVar: 'var(--badge-feature-border)' },
  bug: { label: 'Bug', colorVar: 'var(--badge-bug-color)', bgVar: 'var(--badge-bug-bg)', borderVar: 'var(--badge-bug-border)' },
  documentation: { label: 'Docs', colorVar: 'var(--badge-doc-color)', bgVar: 'var(--badge-doc-bg)', borderVar: 'var(--badge-doc-border)' },
  other: { label: 'Other', colorVar: 'var(--badge-other-color)', bgVar: 'var(--badge-other-bg)', borderVar: 'var(--badge-other-border)' },
};

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const config = typeConfig[type] || typeConfig.other;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium px-2 py-0.5 rounded-full border",
        className
      )}
      style={{
        backgroundColor: config.bgVar,
        color: config.colorVar,
        borderColor: config.borderVar,
      }}
    >
      {config.label}
    </Badge>
  );
}
