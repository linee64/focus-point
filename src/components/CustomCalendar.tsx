import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

interface CustomCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export const CustomCalendar = ({ selectedDate, onSelect, onClose }: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-bold capitalize">
        {format(currentMonth, 'MMMM yyyy', { locale: ru })}
      </h3>
      <div className="flex gap-2">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);

        days.push(
          <div
            key={day.toString()}
            className={`relative p-1 aspect-square flex items-center justify-center cursor-pointer rounded-xl transition-all
              ${!isCurrentMonth ? 'text-gray-700' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
              ${isSelected ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/30 hover:bg-[#7C3AED]' : ''}
              ${isTodayDate && !isSelected ? 'text-[#8B5CF6] font-bold' : ''}
            `}
            onClick={() => {
              onSelect(cloneDay);
              onClose();
            }}
          >
            <span className="text-sm">{formattedDate}</span>
            {isTodayDate && !isSelected && (
              <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#8B5CF6]"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1E1E24] border border-white/10 rounded-2xl p-4 shadow-2xl w-full"
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </motion.div>
  );
};
