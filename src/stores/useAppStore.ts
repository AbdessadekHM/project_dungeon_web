import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/features/projects/types';

interface AppState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
    }),
    {
      name: 'app-storage',
    }
  )
);
