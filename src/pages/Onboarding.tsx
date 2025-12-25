import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop",
    title: "Умное планирование",
    description: "ИИ составляет расписание за тебя, учитывая твои силы и время."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    title: "Никаких перегрузок",
    description: "Система следит за твоим состоянием и адаптирует нагрузку."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    title: "Достигай целей",
    description: "Готов начать свой путь к эффективной учебе?"
  }
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const completeOnboarding = useStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Image Container */}
            <div className="h-[60%] w-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Text Container */}
            <div className="flex-1 px-8 pt-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-32 w-full flex justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-8 pb-12">
        {currentSlide === slides.length - 1 ? (
          <div className="space-y-3">
            <button 
              onClick={completeOnboarding}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Регистрация
            </button>
            <button 
              onClick={completeOnboarding}
              className="w-full bg-surface border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Войти
            </button>
          </div>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-lg"
          >
            Далее <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
