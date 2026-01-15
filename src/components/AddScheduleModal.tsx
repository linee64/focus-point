import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CustomCalendar } from './CustomCalendar';
import { TimePicker } from './TimePicker';

import { ScheduleEvent } from '../types';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: ScheduleEvent | null;
  initialDate?: Date;
}

export const AddScheduleModal = ({ isOpen, onClose, eventToEdit, initialDate }: AddScheduleModalProps) => {
  const { addScheduleEvent, updateScheduleEvent, schedule } = useStore();
  
  const [title, setTitle] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>('none');

  const subjectsMap: Record<string, string[]> = {
    'Математика': ['ДЗ в учебнике', 'Повторить формулы', 'Подготовиться к контрольной'],
    'Русский язык': ['Упражнение', 'Словарные слова', 'Сочинение'],
    'Физика': ['Лабораторная работа', 'Решить задачи', 'Прочитать параграф'],
    'История': ['Даты', 'Пересказ', 'Контурные карты'],
    'Английский язык': ['Слова', 'Грамматика', 'Чтение'],
    'География': ['Карта', 'Доклад'],
    'Биология': ['Термины', 'Рисунок'],
  };

  // Update fields when eventToEdit or initialDate changes
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setDate(eventToEdit.date ? parseISO(eventToEdit.date) : new Date());
      setSubtasks(eventToEdit.subtasks || ['']);
    } else if (initialDate) {
      setDate(initialDate);
      setTitle('');
      setSubtasks(['']);
      
      // Auto-set time based on existing events for this day
      const dayEvents = schedule
        .filter(e => e.date === format(initialDate, 'yyyy-MM-dd'))
        .sort((a, b) => b.endTime.localeCompare(a.endTime));
      
      if (dayEvents.length > 0) {
        const lastEvent = dayEvents[0];
        setStartTime(lastEvent.endTime);
        // Set end time to 45 mins after start (standard lesson)
        const [h, m] = lastEvent.endTime.split(':').map(Number);
        const endMinutes = h * 60 + m + 45;
        const endH = Math.floor(endMinutes / 60) % 24;
        const endM = endMinutes % 60;
        setEndTime(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
      } else {
        setStartTime('08:30');
        setEndTime('09:15');
      }
    }
  }, [eventToEdit, initialDate, isOpen, schedule]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    // Auto-fill subtasks if subject matches
    if (subjectsMap[newTitle] && subtasks.every(s => s === '')) {
      setSubtasks(subjectsMap[newTitle]);
    }
  };

  const handleAddSubtask = () => setSubtasks([...subtasks, '']);
  const handleRemoveSubtask = (index: number) => setSubtasks(subtasks.filter((_, i) => i !== index));
  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const eventData = {
      title,
      date: format(date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      subtasks: subtasks.filter(s => s.trim() !== ''),
      type: 'school' as const,
    };

    if (eventToEdit) {
      updateScheduleEvent(eventToEdit.id, eventData);
    } else {
      addScheduleEvent(eventData);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-[#18181B] border border-white/10 rounded-3xl shadow-2xl relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">{eventToEdit ? 'Изменить событие' : 'Новое событие'}</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 ml-1">Название</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Например: Математика"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                    required
                  />
                </div>
                
                {/* Подсказки предметов */}
                {!eventToEdit && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.keys(subjectsMap).map(subject => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => handleTitleChange(subject)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          title === subject 
                            ? "bg-[#8B5CF6] text-white" 
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 ml-1">Подзадачи</label>
                <div className="space-y-2">
                  {subtasks.map((sub, index) => (
                    <div key={index} className="flex gap-2 group/sub">
                      <input
                        type="text"
                        placeholder="Что нужно сделать?"
                        value={sub}
                        onChange={(e) => handleSubtaskChange(index, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
                      />
                      {subtasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(index)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover/sub:opacity-100 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="flex items-center gap-2 text-xs text-[#8B5CF6] font-bold hover:text-[#7C3AED] transition-colors ml-1 mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    Добавить подзадачу
                  </button>
                </div>
              </div>

              <div className="space-y-4 relative z-30">
                   <TimePicker
                     label="Время начала"
                     value={startTime}
                     onChange={setStartTime}
                   />
                 </div>
 
               <div className="space-y-1.5 relative z-20">
                <label className="text-xs font-medium text-gray-400 ml-1">Дата</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-left text-white"
                  >
                    {format(date, 'd MMMM yyyy', { locale: ru })}
                  </button>
                </div>
                <AnimatePresence>
                  {showCalendar && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-20">
                      <CustomCalendar
                        selectedDate={date}
                        onSelect={(d) => { setDate(d); setShowCalendar(false); }}
                        onClose={() => setShowCalendar(false)}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 ml-1">Повторять</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Нет' },
                    { id: 'daily', label: 'День' },
                    { id: 'weekly', label: 'Неделя' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRepeat(item.id as any)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        repeat === item.id ? 'bg-[#8B5CF6] text-white' : 'bg-white/5 text-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all mt-2"
              >
                Готово
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};