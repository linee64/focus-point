import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CustomCalendar } from './CustomCalendar';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  const addTask = useStore((state) => state.addTask);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [type, setType] = useState<'homework' | 'project' | 'exam' | 'other'>('homework');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !subject) {
      // Можно добавить тряску или уведомление
      return;
    }

    addTask({
      title,
      subject,
      deadline: date.toISOString(),
      type,
    });

    // Reset and close
    setTitle('');
    setSubject('');
    setDate(null);
    setType('homework');
    onClose();
  };

  const isFormValid = title.trim() !== '' && subject.trim() !== '' && date !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[10vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-sm bg-[#18181B] border border-white/10 rounded-3xl shadow-2xl relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#18181B]">
                <h3 className="font-bold text-white text-lg">Новая задача</h3>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">Предмет</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Например: Математика"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">Задание</label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Например: Стр. 45 №3, 4"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8B5CF6]/50 focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5 relative z-20">
                  <label className="text-xs font-medium text-gray-400 ml-1">Дедлайн</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-left transition-all ${date ? 'text-white' : 'text-gray-600'}`}
                    >
                      {date ? format(date, 'd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showCalendar && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-10">
                        <CustomCalendar 
                          selectedDate={date} 
                          onSelect={(d) => {
                            setDate(d);
                            setShowCalendar(false);
                          }}
                          onClose={() => setShowCalendar(false)}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">Тип</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'homework', label: 'ДЗ' },
                      { id: 'project', label: 'Проект' },
                      { id: 'exam', label: 'Экз' },
                      { id: 'other', label: 'Другое' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id as any)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          type === item.id 
                            ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] mt-4 ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:shadow-lg hover:shadow-purple-500/20' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Добавить задачу
                </button>
              </form>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
