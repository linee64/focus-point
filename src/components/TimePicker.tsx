import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export const TimePicker = ({ value, onChange, label }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value.split(':')[0]);
  const [minutes, setMinutes] = useState(value.split(':')[1]);
  
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSelect = (h: string, m: string) => {
    setHours(h);
    setMinutes(m);
    onChange(`${h}:${m}`);
  };

  useEffect(() => {
    if (isOpen) {
      const hIdx = hourOptions.indexOf(hours);
      const mIdx = minuteOptions.indexOf(minutes);
      
      if (hoursRef.current) {
        hoursRef.current.scrollTop = hIdx * 40;
      }
      if (minutesRef.current) {
        minutesRef.current.scrollTop = mIdx * 40;
      }
    }
  }, [isOpen]);

  return (
    <div className="space-y-1.5 relative">
      <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-left text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
        >
          {hours}:{minutes}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
              <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E24] border border-white/10 rounded-2xl shadow-2xl p-4 z-[110] flex flex-col gap-4"
                      >
              <div className="flex justify-around items-center h-40">
                <div 
                  ref={hoursRef}
                  className="w-16 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
                >
                  <div className="h-16" /> {/* Padding */}
                  {hourOptions.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleSelect(h, minutes)}
                      className={`h-10 w-full flex items-center justify-center snap-center transition-all ${
                        hours === h ? 'text-[#8B5CF6] font-bold text-lg' : 'text-gray-500 text-sm'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                  <div className="h-16" /> {/* Padding */}
                </div>

                <div className="text-gray-500 font-bold">:</div>

                <div 
                  ref={minutesRef}
                  className="w-16 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
                >
                  <div className="h-16" /> {/* Padding */}
                  {minuteOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelect(hours, m)}
                      className={`h-10 w-full flex items-center justify-center snap-center transition-all ${
                        minutes === m ? 'text-[#8B5CF6] font-bold text-lg' : 'text-gray-500 text-sm'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                  <div className="h-16" /> {/* Padding */}
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold"
              >
                Выбрать
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};