import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Coffee, Utensils, Moon, Save, ChevronDown, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';

interface DailyRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, isOpen, onToggle }) => {
  const [hours, minutes] = value.split(':');
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  useEffect(() => {
    if (isOpen) {
      const hIndex = hoursArray.indexOf(hours);
      const mIndex = minutesArray.indexOf(minutes);
      
      if (hoursRef.current) {
        hoursRef.current.scrollTop = hIndex * 40;
      }
      if (minutesRef.current) {
        minutesRef.current.scrollTop = mIndex * 40;
      }
    }
  }, [isOpen, hours, minutes]);

  const handleScroll = (type: 'h' | 'm', e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / 40);
    
    if (type === 'h') {
      const newHour = hoursArray[Math.max(0, Math.min(23, index))];
      if (newHour !== hours) onChange(`${newHour}:${minutes}`);
    } else {
      const newMinute = minutesArray[Math.max(0, Math.min(59, index))];
      if (newMinute !== minutes) onChange(`${hours}:${newMinute}`);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={onToggle}
        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white text-left flex items-center justify-between hover:bg-white/10 transition-colors focus:outline-none"
      >
        <span className="text-lg font-medium">{value}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E24] border border-white/10 rounded-2xl shadow-2xl p-4 z-[110] flex flex-col gap-4"
          >
            <div className="flex justify-around items-center h-40 relative">
              {/* Selection Highlight */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-10 bg-purple-500/10 rounded-xl pointer-events-none border border-purple-500/20" />
              
              {/* Hours */}
              <div 
                ref={hoursRef}
                onScroll={(e) => handleScroll('h', e)}
                className="w-16 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
              >
                <div className="h-16" /> {/* Padding top */}
                {hoursArray.map((h) => (
                  <button
                    key={h}
                    onClick={() => onChange(`${h}:${minutes}`)}
                    className={`h-10 w-full flex items-center justify-center snap-center transition-all ${
                      h === hours ? 'text-[#8B5CF6] font-bold text-lg' : 'text-gray-500 text-sm'
                    }`}
                  >
                    {h}
                  </button>
                ))}
                <div className="h-16" /> {/* Padding bottom */}
              </div>

              <div className="text-gray-500 font-bold">:</div>

              {/* Minutes */}
              <div 
                ref={minutesRef}
                onScroll={(e) => handleScroll('m', e)}
                className="w-16 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
              >
                <div className="h-16" /> {/* Padding top */}
                {minutesArray.map((m) => (
                  <button
                    key={m}
                    onClick={() => onChange(`${hours}:${m}`)}
                    className={`h-10 w-full flex items-center justify-center snap-center transition-all ${
                      m === minutes ? 'text-[#8B5CF6] font-bold text-lg' : 'text-gray-500 text-sm'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <div className="h-16" /> {/* Padding bottom */}
              </div>
            </div>
            
            <button
              onClick={onToggle}
              className="w-full py-2 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold"
            >
              Выбрать
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DailyRoutineModal: React.FC<DailyRoutineModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const routineItems = [
    { key: 'wakeUpTime', label: 'Подъем', icon: Sun, color: 'text-yellow-400' },
    { key: 'breakfastTime', label: 'Завтрак', icon: Coffee, color: 'text-orange-400' },
    { key: 'lunchTime', label: 'Обед', icon: Utensils, color: 'text-blue-400' },
    { key: 'dinnerTime', label: 'Ужин', icon: Utensils, color: 'text-purple-400' },
    { key: 'bedTime', label: 'Сон', icon: Moon, color: 'text-indigo-400' },
  ];

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
            className="fixed left-4 right-4 top-[10%] bg-[#18181B] border border-white/10 rounded-3xl z-[51] shadow-2xl max-w-md mx-auto overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#18181B]">
              <h2 className="text-lg font-bold text-white">Режим дня</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {routineItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="relative">
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <label className="text-sm text-gray-400">{item.label}</label>
                    </div>
                    <TimePicker
                      value={localSettings[item.key as keyof typeof settings] as string}
                      onChange={(newTime) => setLocalSettings({ ...localSettings, [item.key]: newTime })}
                      isOpen={openPicker === item.key}
                      onToggle={() => setOpenPicker(openPicker === item.key ? null : item.key)}
                    />
                  </div>
                );
              })}

              {/* Commute Time Field */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 ml-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <label className="text-sm text-gray-400">Дорога до школы (мин)</label>
                </div>
                <input
                  type="number"
                  value={localSettings.commuteTime === 0 ? '' : localSettings.commuteTime}
                  onChange={(e) => setLocalSettings({ ...localSettings, commuteTime: parseInt(e.target.value) || 0 })}
                  placeholder="30"
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Сохранить изменения
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
