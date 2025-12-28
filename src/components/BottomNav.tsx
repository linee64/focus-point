import { Calendar, Brain, Home, Target, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: Calendar, label: 'Расписание', path: '/schedule' },
    { icon: Target, label: 'Дедлайны', path: '/deadlines' },
    { icon: Brain, label: 'Повтор', path: '/review' },
    { icon: User, label: 'Профиль', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-[#0B0B0F]/95 backdrop-blur-md border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-[72px] pb-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200 gap-1",
                isActive ? "text-[#8B5CF6]" : "text-[#52525B] hover:text-gray-400"
              )}
            >
              <div className={clsx(
                "p-1 rounded-xl transition-all duration-200",
                isActive && "bg-[#8B5CF6]/10"
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
