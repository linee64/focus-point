import { Calendar, CheckSquare, Brain, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Calendar, label: 'Расписание', path: '/' },
    { icon: CheckSquare, label: 'Задачи', path: '/tasks' },
    { icon: Brain, label: 'ИИ Тьютор', path: '/tutor' },
    { icon: Settings, label: 'Настройки', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-surface/95 backdrop-blur-md border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                isActive ? "text-primary-light" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
