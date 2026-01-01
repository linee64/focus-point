import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Bell, Sparkles, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

export const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = [...Array(5)].map((_, i) => addDays(currentWeekStart, i)); // Mon-Fri

  const events = [
    { time: '08:30', title: 'Математика', location: '204', color: 'bg-purple-500' },
    { time: '09:20', title: 'Русский язык', location: '301', color: 'bg-blue-500' },
    { time: '10:20', title: 'Физика', location: '105', color: 'bg-purple-500' },
    { time: '11:15', title: 'История', location: '302', color: 'bg-orange-500' },
    { time: '15:00', title: 'ДЗ Математика', location: 'Дом', tag: 'ДЗ', color: 'bg-white' },
    { time: '17:00', title: 'Футбол', location: 'Стадион', icon: '⚽', color: 'bg-purple-500' },
  ];

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
        <button className="p-2 rounded-full bg-[#18181B] hover:bg-[#27272A] transition-colors border border-white/5 relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full ring-2 ring-[#18181B]"></div>
        </button>
      </header>

      {/* Page Title & Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Расписание</h2>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181B] border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {/* Date Strip */}
      <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {weekDays.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
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
        <p className="text-gray-500 text-sm">Понедельник • 6 событий</p>
        
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors group">
              <div className="w-12 font-bold text-gray-300 text-lg font-mono">{event.time}</div>
              
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-300 text-lg">{event.title}</h3>
                  {event.tag && (
                    <span className="bg-amber-500/20 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {event.tag}
                    </span>
                  )}
                  {event.icon && (
                    <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {event.icon}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
