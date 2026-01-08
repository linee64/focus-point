import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Bell, Sparkles, MapPin, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { AddScheduleModal } from '../components/AddScheduleModal';

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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#8B5CF6]">SleamAI</h1>
            <p className="text-xs text-gray-400 capitalize">
              {format(new Date(), 'EEEE, d MMMM', { locale: ru })}
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
        <p className="text-gray-500 text-sm">{format(selectedDate, 'EEEE', { locale: ru })} • {filteredSchedule.length} событий</p>
        
        <div className="space-y-3">
          {filteredSchedule.map((event) => (
            <div 
              key={event.id}
              className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors group relative"
            >
              <div className="w-12 font-bold text-gray-300 text-lg font-mono">
                {event.startTime}
              </div>
              <div className={clsx(
                "w-1 h-10 rounded-full bg-gradient-to-b",
                event.type === 'school' ? "from-purple-500 to-blue-500" :
                event.type === 'sleep' ? "from-indigo-500 to-slate-500" :
                "from-amber-500 to-orange-500"
              )}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-300 text-lg truncate">{event.title}</h3>
                </div>
                {event.subtasks && event.subtasks.length > 0 ? (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    {event.subtasks.map((sub, idx) => (
                      <span key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        {sub}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 mt-1 italic">Нет подзадач</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  onClick={() => handleEdit(event)}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                  onClick={() => removeScheduleEvent(event.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
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