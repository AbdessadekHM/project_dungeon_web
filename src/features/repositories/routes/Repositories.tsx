import { Plus, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { useTranslation } from 'react-i18next';

export function Repositories() {
  const { user } = useAuthStore();
  const { selectedProject } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('repositories.title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('repositories.description')}</p>
        </div>
        
        {(user?.role === 'admin' || user?.id === selectedProject?.owner) && (
          <Button 
            className={cn(
              "h-8 rounded-lg text-[13px] font-medium gap-1.5 px-4",
              "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
              "hover:brightness-110 hover:shadow-glow-indigo",
              "transition-all duration-200"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('repositories.addRepository')}
          </Button>
        )}
      </div>

      {/* Empty state */}
      <div className="text-center py-20 px-8 border border-dashed border-border rounded-xl bg-card/50">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Github className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{t('repositories.noRepositories')}</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          {t('repositories.noRepositoriesDesc')}
        </p>
      </div>
    </div>
  );
}
