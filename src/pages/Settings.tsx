import { motion } from 'framer-motion';
import { LogOut, ChevronLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const { logout } = useStore();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-card hover:bg-white/5 transition-colors border border-border"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-2xl font-bold">Настройки</h1>
      </header>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Предпочтения</h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
          <span>Темная тема</span>
          <div className="w-10 h-6 bg-primary rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
          <span>Уведомления</span>
          <div className="w-10 h-6 bg-gray-600 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Аккаунт</h3>
        <button 
          onClick={logout}
          className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex justify-between items-center text-red-500 hover:bg-red-500/20 transition-colors"
        >
          <span className="font-medium">Выйти из аккаунта</span>
          <LogOut size={20} />
        </button>
      </div>
    </motion.div>
  );
};
