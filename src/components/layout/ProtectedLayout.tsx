import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { 
  Users, LayoutDashboard, LogOut, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import logo from '@/assets/logo.png';

export function ProtectedLayout() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admins trying to access regular protected layout to their admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teams', label: 'Teams', icon: Users },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Row */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-3 relative">
        <img src={logo} alt="Project Dungeon" className="h-7 w-7 shrink-0" />
        {!isCollapsed && (
          <span className="font-semibold text-[14px] tracking-tight text-sidebar-foreground truncate pr-6 animate-in fade-in duration-200">
            Project Dungeon
          </span>
        )}
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 absolute right-2 hover:bg-sidebar-accent text-muted-foreground hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 pb-2.5 pt-1 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.08em] animate-in fade-in duration-200">
            Workspace
          </div>
        )}
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 relative ${
                isActive 
                  ? 'nav-active-pill text-primary' 
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!isCollapsed && <span className="animate-in fade-in duration-200">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User avatar at bottom */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg ${isCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="relative shrink-0">
            <Avatar className="h-8 w-8 border-2 border-sidebar-border">
              <AvatarFallback className="bg-primary/15 text-primary font-semibold text-[11px]">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
              </AvatarFallback>
            </Avatar>
            <div className={`presence-dot ${isCollapsed ? 'right-0 -bottom-0.5' : ''}`} />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in duration-200">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">{user?.username || 'User'}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.role || 'Member'}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`hidden md:flex border-r border-sidebar-border bg-sidebar shrink-0 flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[75px]' : 'w-[220px]'
        }`}
      >
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
