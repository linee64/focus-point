import { motion } from 'framer-motion';

export const Settings = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
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
    </motion.div>
  );
};
