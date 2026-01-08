import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Notifications = ({ isOpen, onClose }: NotificationsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Small timeout to prevent immediate closing if triggered by click
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const notifications = [
    {
      id: 1,
      title: 'Дедлайн близко',
      message: 'Завтра сдача проекта по Физике',
      time: '2 ч. назад',
      type: 'warning',
      read: false,
    },
    {
      id: 2,
      title: 'Домашнее задание проверено',
      message: 'Учитель оценил ваше эссе по Истории',
      time: '5 ч. назад',
      type: 'success',
      read: false,
    },
    {
      id: 3,
      title: 'Обновление расписания',
      message: 'Завтра урок Математики перенесен на 10:20',
      time: '1 д. назад',
      type: 'info',
      read: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 flex items-start justify-center pt-16 z-[60] pointer-events-none"
          >
            <div 
              ref={ref}
              className="bg-[#18181B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-4 pointer-events-auto"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#18181B]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#8B5CF6]" />
                  <h3 className="font-bold text-white">Уведомления</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        notification.type === 'warning' ? 'bg-amber-500' :
                        notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#18181B] border-t border-white/5 text-center">
                <button className="text-xs text-[#8B5CF6] font-medium hover:text-[#7C3AED] transition-colors">
                  Пометить все как прочитанные
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
