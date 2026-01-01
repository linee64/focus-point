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
        "w-full max-w-md min-h-screen relative shadow-2xl shadow-black flex flex-col overflow-hidden",
        isDashboard 
          ? "bg-gradient-to-br from-[#1a0536] via-[#050505] via-70% to-[#0a1029]" 
          : "bg-[#0B0B0F]"
      )}>
        {/* Background Elements for non-dashboard pages */}
        {!isDashboard && (
          <>
            <div className="absolute top-[-5%] left-[-10%] w-[200px] h-[200px] bg-purple-900/40 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-5%] right-[-10%] w-[200px] h-[200px] bg-blue-900/40 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          </>
        )}
        
        <main className="flex-1 overflow-y-auto pb-20 p-4 scrollbar-hide relative z-10">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
