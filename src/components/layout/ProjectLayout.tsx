import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { projectApi } from '@/features/projects/api';
import type { Project } from '@/features/projects/types';
import { 
  Menu, LogOut, CheckCircle2, CalendarDays, Github, Bug
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
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import logo from '@/assets/logo.png';

export function ProjectLayout() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { selectedProject, setSelectedProject } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      projectApi.getProjects().then(setProjects).catch(console.error);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!selectedProject) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/projects" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    { path: `/projects/${selectedProject.id}/tasks`, label: 'Dashboard', icon: CheckCircle2 },
    { path: `/projects/${selectedProject.id}/events`, label: 'Events', icon: CalendarDays },
    { path: `/projects/${selectedProject.id}/repositories`, label: 'Repositories', icon: Github },
    { path: `/projects/${selectedProject.id}/issues`, label: 'Issues', icon: Bug },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Row */}
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border gap-3">
        <img src={logo} alt="Project Dungeon" className="h-7 w-7 cursor-pointer" onClick={() => setSelectedProject(null)} />
        <span 
          className="font-semibold text-[14px] tracking-tight text-sidebar-foreground cursor-pointer hover:text-primary transition-colors duration-200 truncate"
          onClick={() => setSelectedProject(null)}
          title="Back to Main Dashboard"
        >
          Project Dungeon
        </span>
      </div>

      {/* Project Switcher */}
      <div className="px-3 pt-4 pb-2">
        {selectedProject && (
          <Select 
            value={selectedProject.id.toString()} 
            onValueChange={(val) => {
              const proj = projects.find(p => p.id.toString() === val);
              if (proj) {
                setSelectedProject(proj);
                navigate(`/projects/${proj.id}/tasks`);
              }
            }}
          >
            <SelectTrigger className="w-full h-9 text-[13px] font-medium border-sidebar-border bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors duration-200 rounded-lg">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent align="start" className="border-border shadow-lg">
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id.toString()} className="cursor-pointer text-[13px]">
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator className="mx-3 bg-sidebar-border" />
      
      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        <div className="px-3 pb-2.5 pt-1 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.08em]">
          Project
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 relative ${
                isActive 
                  ? 'nav-active-pill text-primary' 
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Exit Project + User */}
      <div className="border-t border-sidebar-border">
        <div className="p-3">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground text-[13px] h-8 rounded-lg"
            onClick={() => setSelectedProject(null)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Exit Project
          </Button>
        </div>
        <div className="px-3 pb-3">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-sidebar-border">
                <AvatarFallback className="bg-primary/15 text-primary font-semibold text-[11px]">
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="presence-dot" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">{user?.username || 'User'}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.role || 'Member'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[220px] border-r border-sidebar-border bg-sidebar shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[220px] p-0 shrink-0 flex flex-col bg-sidebar border-r-sidebar-border">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Access site navigation</SheetDescription>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-8 w-8 border-2 border-border hover:border-primary/50 transition-all duration-200 cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[11px]">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 border-border shadow-lg">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-[13px] font-medium leading-none">{user?.username || 'User'}</p>
                    <p className="text-[11px] leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={clearAuth} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-[13px]">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
