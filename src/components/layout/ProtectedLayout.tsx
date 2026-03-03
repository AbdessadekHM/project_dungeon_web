import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { 
  Users, LayoutDashboard, LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
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

  // Mock data for the switcher options, ideally this would come from an API query
  const mockProjects = [
    { id: 1, title: 'Project Alpha', description: 'Main frontend development for the game.', owner: 1, collaborators: [2, 3], tasks_count: 12, repositories: [], teams: [] },
    { id: 2, title: 'Backend API', description: 'Django REST framework implementation.', owner: 1, collaborators: [4], tasks_count: 5, repositories: [], teams: [] },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border gap-3">
          <img src={logo} alt="Project Dungeon" className="h-8 w-8" />
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground">Project Dungeon</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-sidebar-primary' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {selectedProject && (
              <Select 
                value={selectedProject.id.toString()} 
                onValueChange={(val) => {
                  const proj = mockProjects.find(p => p.id.toString() === val);
                  if (proj) setSelectedProject(proj);
                }}
              >
                <SelectTrigger className="w-[200px] border-transparent hover:border-border hover:bg-muted/50 transition-colors shadow-none focus:ring-0">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
                    </SelectItem>
                  ))}
                  <DropdownMenuSeparator />
                  <div 
                    className="p-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
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
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-9 w-9 border border-border shadow-sm transition-transform hover:scale-105 cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearAuth} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
