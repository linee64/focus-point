import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Clock, BookOpen, Moon, Activity, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Edit2, Check, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { format, addDays, startOfWeek, addMonths, subMonths, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

export const Dashboard = () => {
  const { tasks } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate 7 days starting from today or start of week? Let's do current week view or next 7 days.
  // User asked for "7 mini cards". Let's show next 7 days starting from today for utility.
  // User Update: Show current week (Mon-Sun)
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));

  // Calendar Modal Logic
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        days.push(
          <div
            key={day.toString()}
            className={clsx(
              "p-2 w-full text-center text-sm rounded-lg cursor-pointer transition-colors relative",
              !isSameMonth(day, monthStart) ? "text-gray-600" : "text-white",
              isSameDay(day, selectedDate) ? "bg-primary text-white font-bold" : "hover:bg-white/10",
              isToday(day) && !isSameDay(day, selectedDate) && "border border-primary text-primary"
            )}
            onClick={() => {
              setSelectedDate(cloneDay);
              setIsCalendarOpen(false);
            }}
          >
            {formattedDate}
            {/* Dot for tasks indicator could go here */}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  const timeSlots = [
    { time: '07:00', label: 'Подъем', type: 'system' },
    { time: '08:00', label: 'Школа', type: 'school', duration: '6ч' },
    { time: '14:00', label: 'Обед и Отдых', type: 'break' },
    { time: '15:00', label: 'Математика (Повторение)', type: 'study', task: tasks[0] },
    { time: '16:00', label: 'Тренировка', type: 'activity' },
    { time: '18:00', label: 'Ужин', type: 'break' },
    { time: '19:00', label: 'Проект по Истории', type: 'study', task: tasks[1] },
    { time: '20:00', label: 'Свободное время', type: 'break' },
    { time: '23:00', label: 'Сон', type: 'sleep' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'sleep': return <Moon size={16} />;
      case 'school': return <BookOpen size={16} />;
      case 'activity': return <Activity size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'school': return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'study': return 'bg-primary/20 border-primary/30 text-primary-light';
      case 'activity': return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'sleep': return 'bg-indigo-900/20 border-indigo-500/30 text-indigo-300';
      default: return 'bg-white/5 border-white/10 text-gray-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
    >
      {/* Header with Date Strip */}
      <header className="space-y-8">
        <div className="flex items-center gap-3 px-2 mt-5">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black to-primary border border-white/10 shadow-lg shadow-primary/20"></div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
            SleamAI
          </h1>
        </div>

        {/* Date Strip */}
        <div className="flex justify-between items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {weekDays.map((date, i) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <div
                key={i}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  "min-w-[40px] h-14 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border",
                  isSelected 
                    ? "bg-primary border-primary shadow-lg shadow-primary/20 scale-105" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <span className={clsx("text-[9px] uppercase font-bold", isSelected ? "text-white/80" : "text-gray-500")}>
                  {format(date, 'EEEEEE', { locale: ru })}
                </span>
                <span className={clsx("text-base font-bold", isSelected ? "text-white" : "text-gray-300")}>
                  {format(date, 'd')}
                </span>
              </div>
            )
          })}
        </div>
      </header>

      {/* Timeline */}
      <div className="space-y-3 relative pb-20">
        {/* Actions Bar */}
        <div className="flex justify-between items-center px-2">
           <button 
             onClick={() => setIsCalendarOpen(true)}
             className="flex items-center gap-2 text-sm text-gray-400 font-medium hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/5"
           >
             <CalendarIcon size={16} />
             <span>Календарь</span>
           </button>

           <button className="flex items-center gap-2 text-sm text-primary-light font-medium bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
             <Plus size={16} />
             Добавить пункт
           </button>
        </div>

        <div className="absolute left-[2.25rem] top-12 bottom-4 w-0.5 bg-white/10"></div>

        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-4 relative z-10">
            <div className="w-14 text-sm text-gray-500 font-mono pt-3 text-right">
              {slot.time}
            </div>
            <div className={clsx(
              "flex-1 p-3 rounded-xl border flex items-center gap-3 relative group",
              getColor(slot.type)
            )}>
              <div className={clsx("p-2 rounded-lg bg-black/20")}>
                {getIcon(slot.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{slot.label}</div>
                {slot.duration && <div className="text-xs opacity-70">{slot.duration}</div>}
              </div>
              
              {/* Actions */}
              {slot.type !== 'system' && (
                <div className="flex gap-2">
                   <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/80">
                     <Edit2 size={12} />
                   </button>
                   <button className="p-1.5 rounded-full bg-white/10 hover:bg-green-500/20 hover:text-green-400 transition-colors text-white/80">
                     <Check size={12} />
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsCalendarOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[15%] bg-surface border border-white/10 rounded-2xl p-4 z-50 shadow-2xl shadow-primary/20 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold capitalize">
                  {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white/10 rounded-lg">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white/10 rounded-lg">
                    <ChevronRight size={20} />
                  </button>
                  <button onClick={() => setIsCalendarOpen(false)} className="p-1 hover:bg-white/10 rounded-lg ml-2">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-xs text-gray-500 font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              {renderCalendarDays()}

              <button 
                className="w-full mt-4 bg-primary/20 text-primary-light font-bold py-3 rounded-xl hover:bg-primary/30 transition-colors text-sm"
                onClick={() => {
                  setSelectedDate(new Date());
                  setIsCalendarOpen(false);
                }}
              >
                Вернуться к сегодня
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
