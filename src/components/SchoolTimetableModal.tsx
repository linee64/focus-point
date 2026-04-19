import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Clock, Trash2, Plus, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SchoolTimetableItem } from '../types';

interface SchoolTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolTimetableModal: React.FC<SchoolTimetableModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useStore();
  const [localTimetable, setLocalTimetable] = useState<SchoolTimetableItem[]>(
    settings.schoolTimetable || [
      { duration: 45, breakAfter: 5 },
      { duration: 45, breakAfter: 10 },
      { duration: 45, breakAfter: 15 },
      { duration: 45, breakAfter: 10 },
      { duration: 45, breakAfter: 5 },
      { duration: 45, breakAfter: 5 },
    ]
  );

  const handleSave = () => {
    updateSettings({ schoolTimetable: localTimetable });
    onClose();
  };

  const handleUpdateItem = (index: number, field: keyof SchoolTimetableItem, value: number) => {
    const newTimetable = [...localTimetable];
    newTimetable[index] = { ...newTimetable[index], [field]: value };
    setLocalTimetable(newTimetable);
  };

  const handleAddItem = () => {
    setLocalTimetable([...localTimetable, { duration: 45, breakAfter: 5 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (localTimetable.length <= 1) return;
    setLocalTimetable(localTimetable.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-4 right-4 top-[10%] bottom-[10%] bg-[#18181B] border border-white/10 rounded-3xl z-[51] shadow-2xl max-w-md mx-auto flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#18181B] shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Расписание звонков</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200/70 leading-relaxed">
                  Настрой длительность каждого урока и перемены после него. Это поможет ИИ точнее планировать твой день.
                </p>
              </div>

              {localTimetable.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      {index + 1} Урок
                    </span>
                    {localTimetable.length > 1 && (
                      <button 
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 ml-1">Длительность (мин)</label>
                      <input
                        type="number"
                        value={item.duration}
                        onChange={(e) => handleUpdateItem(index, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 ml-1">Перемена после (мин)</label>
                      <input
                        type="number"
                        value={item.breakAfter}
                        onChange={(e) => handleUpdateItem(index, 'breakAfter', parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddItem}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-purple-400 hover:border-purple-500/30 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Добавить урок
              </button>
            </div>

            <div className="p-5 border-t border-white/5 bg-[#18181B] shrink-0">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Сохранить расписание
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
