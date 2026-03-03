import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { projectApi } from '@/features/projects/api';
import type { Project } from '@/features/projects/types';
import { 
  Users, LayoutDashboard, LogOut, Menu
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import logo from '@/assets/logo.png';

export function ProtectedLayout() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { selectedProject, setSelectedProject } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teams', label: 'Teams', icon: Users },
  ];

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      projectApi.getProjects().then(setProjects).catch(console.error);
    }
  }, [isAuthenticated]);

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-border/50 gap-3">
        <img src={logo} alt="Project Dungeon" className="h-8 w-8" />
        <span className="font-bold text-lg tracking-tight text-foreground">Project Dungeon</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all relative ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-md shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
              )}
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border/50 bg-card/50 backdrop-blur-md shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-border/50 bg-card/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 shrink-0 flex flex-col bg-card/95 backdrop-blur-xl border-r-border/50">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Access site navigation</SheetDescription>
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {selectedProject && (
              <Select 
                value={selectedProject.id.toString()} 
                onValueChange={(val) => {
                  const proj = projects.find(p => p.id.toString() === val);
                  if (proj) setSelectedProject(proj);
                }}
              >
                <SelectTrigger className="w-[160px] sm:w-[200px] border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors shadow-sm focus:ring-1 focus:ring-primary/30 rounded-lg">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent align="start" className="border-border/50 shadow-ambient">
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()} className="cursor-pointer">
                      {project.title}
                    </SelectItem>
                  ))}
                  <DropdownMenuSeparator className="bg-border/50" />
                  <div 
                    className="p-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer rounded-sm transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProject(null);
                    }}
                  >
                    Clear Selection
                  </div>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 shadow-sm transition-all hover:scale-105 cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 border-border/50 shadow-ambient">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={clearAuth} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
