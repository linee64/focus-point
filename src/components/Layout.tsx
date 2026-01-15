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
  const isAIChat = location.pathname === '/ai-chat';

  return (
    <div className="min-h-screen bg-background text-white font-sans flex justify-center">
      <div className={clsx(
        "w-full min-h-screen relative shadow-2xl shadow-black flex flex-col overflow-hidden",
        !isAIChat && "max-w-md",
        isDashboard 
          ? "bg-gradient-to-br from-[#1a0536] via-[#050505] via-70% to-[#0a1029]" 
          : "bg-[#0B0B0F]"
      )}>
        {/* Background Elements for non-dashboard pages */}
        {!isDashboard && !isAIChat && (
          <>
            <div className="absolute top-[-5%] left-[-10%] w-[200px] h-[200px] bg-purple-900/40 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-5%] right-[-10%] w-[200px] h-[200px] bg-blue-900/40 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          </>
        )}
        
        <main className={clsx(
          "flex-1 relative z-10",
          !isAIChat ? "overflow-y-auto p-4 pb-20 custom-scrollbar" : "overflow-hidden p-0"
        )}>
          {children}
        </main>

        {!isAIChat && <BottomNav />}
      </div>
    </div>
  );
};
