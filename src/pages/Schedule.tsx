import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Bell, Sparkles, ChevronLeft, ChevronRight, MapPin, Pencil, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { AddScheduleModal } from '../components/AddScheduleModal';
import { AIScheduleAnalysis } from '../components/AIScheduleAnalysis';

export const Schedule = () => {
  const { setNotificationsOpen, isAddScheduleOpen, setAddScheduleOpen, schedule, removeScheduleEvent } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [baseDate, setBaseDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setAddScheduleOpen(true);
  };

  const handleCloseModal = () => {
    setAddScheduleOpen(false);
    setEditingEvent(null);
  };
  
  const currentWeekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeekStart, i)); // Mon-Sun

  const handlePrevWeek = () => setBaseDate(subWeeks(baseDate, 1));
  const handleNextWeek = () => setBaseDate(addWeeks(baseDate, 1));

  const filteredSchedule = schedule.filter(event => 
    event.date === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <header className="flex justify-between items-center pt-2 px-1">
        <div className="flex gap-3 items-center">
          <img src="/logotype.png" alt="SleamAI Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-[#8B5CF6]">SleamAI</h1>
            <p className="text-xs text-gray-400 capitalize">
              {format(selectedDate, 'EEEE, d MMMM', { locale: ru })}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setNotificationsOpen(true)}
          className="p-2 rounded-full bg-[#18181B] hover:bg-[#27272A] transition-colors border border-white/5 relative"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full ring-2 ring-[#18181B]"></div>
        </button>
      </header>

      {/* Page Title & Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Расписание</h2>
          </div>
          <span className="text-[10px] text-gray-500 font-medium ml-8 uppercase tracking-wider">
            {format(currentWeekStart, 'd MMM', { locale: ru })} - {format(addDays(currentWeekStart, 6), 'd MMM', { locale: ru })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#18181B] border border-white/10 rounded-xl overflow-hidden">
            <button 
              onClick={handlePrevWeek}
              className="p-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors border-r border-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextWeek}
              className="p-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setAddScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors text-sm font-bold text-white shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
      </div>

      {/* Date Strip */}
      <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        {weekDays.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          return (
            <div
              key={i}
              onClick={() => setSelectedDate(date)}
              className={clsx(
                "flex-1 min-w-[60px] h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border relative overflow-hidden",
                isSelected 
                  ? "bg-gradient-to-br from-[#8B5CF6] to-[#6366f1] border-transparent shadow-lg shadow-purple-500/30" 
                  : "bg-[#18181B] border-white/5 hover:border-white/10"
              )}
            >
              {isToday && !isSelected && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
              )}
              <span className={clsx("text-xs font-medium mb-1 capitalize", isSelected ? "text-white/90" : "text-gray-500")}>
                {format(date, 'EE', { locale: ru })}
              </span>
              <span className={clsx("text-xl font-bold", isSelected ? "text-white" : "text-gray-300")}>
                {format(date, 'd')}
              </span>
              {isSelected && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-white" />}
            </div>
          )
        })}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {/* AI Analysis Component */}
        <AIScheduleAnalysis selectedDate={selectedDate} />
      </div>
      <AddScheduleModal 
        isOpen={isAddScheduleOpen} 
        onClose={handleCloseModal} 
        eventToEdit={editingEvent} 
        initialDate={selectedDate}
      />
    </motion.div>
  );
};