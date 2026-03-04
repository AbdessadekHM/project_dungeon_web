import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { 
  Users, LayoutDashboard, LogOut, Menu, Key, Shield
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.png';

export function AdminLayout() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ensure only admins can access
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'All Projects', icon: Shield },
    { path: '/admin/teams', label: 'All Teams', icon: Users },
    { path: '/admin/users', label: 'All Users', icon: Key },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Row */}
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border gap-3 bg-red-950/20">
        <img src={logo} alt="Project Dungeon" className="h-7 w-7" />
        <span className="font-semibold text-[14px] tracking-tight text-red-400">Admin Portal</span>
      </div>
      
      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2.5 pt-1 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.08em]">
          Management
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
                  ? 'bg-red-500/10 text-red-400 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.15)]' 
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-red-400' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User avatar at bottom */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-red-500/30">
              <AvatarFallback className="bg-red-500/15 text-red-400 font-semibold text-[11px]">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
              </AvatarFallback>
            </Avatar>
            <div className="presence-dot" style={{ background: '#ef4444' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-sidebar-foreground truncate">{user?.username || 'Admin'}</p>
            <p className="text-[11px] text-red-400/70 truncate">Administrator</p>
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
        <header className="h-14 border-b border-red-500/15 bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle Admin Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[220px] p-0 shrink-0 flex flex-col bg-sidebar border-r-sidebar-border">
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <SheetDescription className="sr-only">Access admin navigation</SheetDescription>
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <Badge variant="outline" className="hidden sm:flex text-red-400 border-red-500/30 bg-red-500/10 text-[11px]">
              Admin Mode
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-8 w-8 border-2 border-red-500/30 hover:border-red-500/60 transition-all duration-200 cursor-pointer">
                  <AvatarFallback className="bg-red-500/10 text-red-400 font-semibold text-[11px]">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 border-border shadow-lg">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-[13px] font-medium leading-none text-red-400">{user?.username || 'Admin'}</p>
                    <p className="text-[11px] leading-none text-muted-foreground">{user?.email || 'admin@example.com'}</p>
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
