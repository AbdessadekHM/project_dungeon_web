import { useEffect, useState } from 'react';
import { Users, Folder, Activity, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../api';
import { projectApi } from '@/features/projects/api';
import { teamApi } from '@/features/teams/api';
import { apiClient } from '@/lib/axios';
import type { Task } from '@/features/tasks/types';

interface DashboardStats {
  totalProjects: number;
  totalTeams: number;
  totalUsers: number;
  activeTasks: number;
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [users, projects, teams, tasksRes] = await Promise.all([
          adminApi.getUsers(),
          projectApi.getProjects(),
          teamApi.getTeams(),
          apiClient.get<Task[]>('/management/tasks/'),
        ]);

        const activeTasks = tasksRes.data.filter(
          (t) => t.status === 'todo' || t.status === 'in_progress'
        ).length;

        setStats({
          totalProjects: projects.length,
          totalTeams: teams.length,
          totalUsers: users.length,
          activeTasks,
        });
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const statCards = [
    {
      label: t('admin.totalProjects'),
      value: stats?.totalProjects,
      icon: Folder,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: t('admin.totalTeams'),
      value: stats?.totalTeams,
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: t('admin.totalUsers'),
      value: stats?.totalUsers,
      icon: Users,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: t('admin.activeTasks'),
      value: stats?.activeTasks,
      icon: CheckCircle2,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-red-400">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('admin.metricsOverview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-5 card-hover-glow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`h-8 w-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            {isLoading ? (
              <div className="h-8 w-16 rounded-md bg-secondary/50 animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {card.value ?? '—'}
              </p>
            )}
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
