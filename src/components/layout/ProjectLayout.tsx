import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { projectApi } from '@/features/projects/api';
import type { Project } from '@/features/projects/types';
import { 
  Menu, LogOut, CheckCircle2, CalendarDays, Github
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
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Row */}
      <div className="h-14 flex items-center px-5 border-b border-border gap-3">
        <img src={logo} alt="Project Dungeon" className="h-7 w-7 cursor-pointer" onClick={() => setSelectedProject(null)} />
        <span 
          className="font-semibold text-[14px] tracking-tight text-foreground cursor-pointer hover:text-primary transition-colors truncate"
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
            <SelectTrigger className="w-full h-9 text-[13px] font-medium border-border bg-secondary/50 hover:bg-secondary transition-colors rounded-md">
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

      <Separator className="mx-3 bg-border" />
      
      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 relative ${
                isActive 
                  ? 'bg-accent-subtle text-primary' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      {/* Exit Project */}
      <div className="p-3 border-t border-border">
         <Button 
           variant="ghost" 
           className="w-full justify-start text-muted-foreground hover:text-foreground text-[13px] h-8"
           onClick={() => setSelectedProject(null)}
         >
            <LogOut className="h-4 w-4 mr-2" />
            Exit Project
         </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[220px] border-r border-border bg-card shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[220px] p-0 shrink-0 flex flex-col bg-card border-r-border">
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
                <Avatar className="h-8 w-8 border-2 border-border hover:border-primary/50 transition-all duration-150 cursor-pointer">
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
