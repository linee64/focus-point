import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-white font-sans flex justify-center">
      <div className="w-full max-w-md bg-surface min-h-screen relative shadow-2xl shadow-black flex flex-col">
        {/* Header Area could go here if global */}
        
        <main className="flex-1 overflow-y-auto pb-20 p-4 scrollbar-hide">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
