import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { clsx } from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background text-white font-sans flex justify-center">
      <div className={clsx(
        "w-full max-w-md min-h-screen relative shadow-2xl shadow-black flex flex-col",
        isDashboard 
          ? "bg-gradient-to-br from-[#1a0536] via-[#050505] via-70% to-[#0a1029]" 
          : "bg-surface"
      )}>
        {/* Header Area could go here if global */}
        
        <main className="flex-1 overflow-y-auto pb-20 p-4 scrollbar-hide">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
