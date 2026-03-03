import React from 'react';
import logo from "@/assets/logo.png"

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden bg-background">
      {/* Premium Decorative Background Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-chart-2/20 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col items-center space-y-3 mb-8">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <img src={logo} className="h-14 w-14" alt="logo" />
          </div>
          <div className="text-center space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-[15px] text-muted-foreground">{description}</p>
          </div>
        </div>
        
        {children}
        
      </div>
    </div>
  );
}
