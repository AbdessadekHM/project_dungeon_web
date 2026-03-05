import { BarChart3, Users, Folder, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
  const { t } = useTranslation();
  
  const stats = [
    { label: t('admin.totalProjects'), value: '—', icon: Folder, color: 'text-primary' },
    { label: t('admin.totalTeams'), value: '—', icon: Users, color: 'text-emerald-500' },
    { label: t('admin.totalUsers'), value: '—', icon: Users, color: 'text-amber-500' },
    { label: t('admin.activeTasks'), value: '—', icon: BarChart3, color: 'text-rose-500' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-red-400">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('admin.metricsOverview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5 card-hover-glow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Placeholder */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">{t('admin.systemActivity')}</h2>
        </div>
        <div className="rounded-xl border border-border bg-card/30 p-8 text-center">
          <p className="text-muted-foreground text-sm">{t('admin.comingSoon')}</p>
        </div>
      </div>
    </div>
  );
}
