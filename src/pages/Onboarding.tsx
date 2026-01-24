import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronRight, ArrowLeft, Check, Eye, EyeOff, Plus, Trash2, Clock, X, Upload, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import Confetti from 'react-confetti';
import { format } from 'date-fns';
import { supabase } from '../services/supabase';

// Custom Time Picker Component
const TimePicker = ({ 
  value, 
  onChange, 
  label 
}: { 
  value: string, 
  onChange: (val: string) => void,
  label: string 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value ? parseInt(value.split(':')[0]) : 12);
  const [selectedMinute, setSelectedMinute] = useState(value ? parseInt(value.split(':')[1]) : 0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value]);

  const handleSave = () => {
    const timeStr = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange(timeStr);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-sm text-gray-400 ml-1 mb-2 block">{label}</label>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white text-left flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <span className={!value ? "text-gray-500" : "text-white"}>
          {value || "--:--"}
        </span>
        <Clock size={20} className="text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-[20%] z-50 bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Выберите время</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex justify-center gap-4 h-48 mb-6">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-2 font-medium">ЧАСЫ</span>
                  <div className="w-20 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory bg-white/5 rounded-xl border border-white/5">
                    <div className="h-[40%]"></div>
                    {hours.map(h => (
                      <div 
                        key={h}
                        onClick={() => setSelectedHour(h)}
                        className={clsx(
                          "h-10 flex items-center justify-center snap-center cursor-pointer transition-colors font-mono text-xl",
                          selectedHour === h ? "bg-primary text-white font-bold" : "text-gray-400 hover:bg-white/5"
                        )}
                      >
                        {h.toString().padStart(2, '0')}
                      </div>
                    ))}
                    <div className="h-[40%]"></div>
                  </div>
                </div>

                <div className="h-full flex items-center text-2xl font-bold text-gray-600 pb-6">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-2 font-medium">МИНУТЫ</span>
                  <div className="w-20 h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory bg-white/5 rounded-xl border border-white/5">
                    <div className="h-[40%]"></div>
                    {minutes.map(m => (
                      <div 
                        key={m}
                        onClick={() => setSelectedMinute(m)}
                        className={clsx(
                          "h-10 flex items-center justify-center snap-center cursor-pointer transition-colors font-mono text-xl",
                          selectedMinute === m ? "bg-primary text-white font-bold" : "text-gray-400 hover:bg-white/5"
                        )}
                      >
                        {m.toString().padStart(2, '0')}
                      </div>
                    ))}
                    <div className="h-[40%]"></div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors"
              >
                Готово
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const [view, setView] = useState<'carousel' | 'register' | 'login' | 'verify-email' | 'name-input' | 'activity-input' | 'step-3' | 'daily-routine' | 'completion'>('carousel');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Schedule upload state
  const [scheduleImage, setScheduleImage] = useState<string | null>(null);
  const [scheduleImageFile, setScheduleImageFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('2 группа');

  // Login specific states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginEmailValid, setIsLoginEmailValid] = useState(false);
  const [showLoginPasswordInput, setShowLoginPasswordInput] = useState(false);
  const [loginShakeButton, setLoginShakeButton] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [schoolShift, setSchoolShift] = useState<'1' | '2' | null>(null);
  const [schoolStartTime, setSchoolStartTime] = useState('08:00');
  const [schoolEndTime, setSchoolEndTime] = useState('14:00');
  const [commuteTime, setCommuteTime] = useState<string>(''); // Время в пути в минутах

  // Activity input specific states
  const [activityName, setActivityName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [activities, setActivities] = useState<Array<{title: string, startTime: string, endTime: string, days: number[]}>>([]);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  // Daily routine state
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [breakfastTime, setBreakfastTime] = useState('07:30');
  const [lunchTime, setLunchTime] = useState('13:00');
  const [dinnerTime, setDinnerTime] = useState('19:00');
  const [bedTime, setBedTime] = useState('23:00');

  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const updateUser = useStore((state) => state.updateUser);
  const addScheduleEvent = useStore((state) => state.addScheduleEvent);
  const updateSettings = useStore((state) => state.updateSettings);

  const getStepInfo = () => {
    switch (view) {
      case 'name-input': return { step: 1, total: 5 };
      case 'activity-input': return { step: 2, total: 5 };
      case 'step-3': return { step: 3, total: 5 };
      case 'daily-routine': return { step: 4, total: 5 };
      case 'completion': return { step: 5, total: 5 };
      default: return null;
    }
  };

  const handleBack = () => {
    switch (view) {
      case 'name-input': setView('register'); break;
      case 'activity-input': setView('name-input'); break;
      case 'step-3': setView('activity-input'); break;
      case 'daily-routine': setView('step-3'); break;
    }
  };

  useEffect(() => {
    // Only allow English letters, numbers, dots, underscores, hyphens before @
    // Only allow English letters, numbers, dots, hyphens after @
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsLoginEmailValid(emailRegex.test(loginEmail));
  }, [loginEmail]);

  useEffect(() => {
    // Must contain English letters AND numbers. Special chars optional. Min 6 chars.
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const validChars = /^[a-zA-Z0-9_{}()\[\]!@#$%^&*+=<>?|~`.-]+$/.test(password);
    
    const isValid = password.length >= 6 && hasLetters && hasNumbers && validChars;
    setIsPasswordValid(isValid);
    if (isValid) setShowPasswordError(false);
  }, [password]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
  };

  const handleCreateAccount = async () => {
    if (isEmailValid && isPasswordValid && firstName && lastName) {
      setIsLoading(true);
      setAuthError(null);
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });

        if (error) throw error;
        
        setView('verify-email');
      } catch (error: any) {
        setAuthError(error.message || 'Ошибка при регистрации');
        setShakeButton(true);
        setTimeout(() => setShakeButton(false), 500);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShakeButton(true);
      if (!isPasswordValid) setShowPasswordError(true);
      setTimeout(() => setShakeButton(false), 500);
    }
  };

  const handleNameSubmit = () => {
    if (firstName && lastName && schoolShift) {
      updateUser(firstName, lastName);
      updateSettings({
        schoolStart: schoolStartTime,
        schoolEnd: schoolEndTime,
        commuteTime: parseInt(commuteTime) || 30
      });
      setView('activity-input');
    }
  };

  const handleAddActivity = () => {
    if (activityName && startTime && endTime && selectedDays.length > 0) {
      setActivities([...activities, { title: activityName, startTime, endTime, days: selectedDays }]);
      setActivityName('');
      setStartTime('');
      setEndTime('');
      setSelectedDays([]);
    }
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleCompleteOnboarding = () => {
    // Сохраняем активности как шаблон (routineActivities)
    updateSettings({
      routineActivities: activities.map(a => ({
        title: a.title,
        startTime: a.startTime,
        endTime: a.endTime,
        type: 'activity'
      }))
    });

    // Также добавляем их в расписание на ближайшие 7 дней (для обратной совместимости)
    activities.forEach(activity => {
      const today = new Date();
      for(let i=0; i<7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const jsDay = d.getDay();
        const uiDay = jsDay === 0 ? 6 : jsDay - 1;
        
        if (activity.days.includes(uiDay)) {
             addScheduleEvent({
                title: activity.title,
                date: format(d, 'yyyy-MM-dd'),
                startTime: activity.startTime,
                endTime: activity.endTime,
                type: 'activity'
            });
        }
      }
    });
    setView('step-3');
  };

  const handleCompleteDailyRoutine = () => {
    updateSettings({
      wakeUpTime,
      breakfastTime,
      lunchTime,
      dinnerTime,
      bedTime
    });
    setView('completion');
  };

  const handleFinishOnboarding = () => {
    completeOnboarding();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      
      // Sync user data from metadata if exists
      if (data.user?.user_metadata) {
        const meta = data.user.user_metadata;
        updateUser(meta.first_name || '', meta.last_name || '');
      }
      
      completeOnboarding();
    } catch (error: any) {
      setLoginShakeButton(true);
      setLoginError(error.message || 'Неверный email или пароль');
      setTimeout(() => setLoginShakeButton(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScheduleImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScheduleImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognizeSchedule = async () => {
    if (!scheduleImageFile) return;
    
    setIsRecognizing(true);
    try {
      const { recognizeScheduleFromImage } = await import('../services/geminiService');
      const recognizedItems = await recognizeScheduleFromImage(scheduleImageFile, selectedGroup);
      
      if (recognizedItems && recognizedItems.length > 0) {
        // Map days from Russian names to indices
        const dayMap: { [key: string]: number } = {
          'понедельник': 0, 'вторник': 1, 'среда': 2, 'четверг': 3, 'пятница': 4, 'суббота': 5, 'воскресенье': 6
        };

        // Get the date for each day of the current week
        const today = new Date();
        const startOfWeekDate = new Date(today);
        const currentDay = today.getDay(); // 0 is Sunday
        const diff = today.getDate() - (currentDay === 0 ? 6 : currentDay - 1);
        startOfWeekDate.setDate(diff);

        recognizedItems.forEach(item => {
          const dayIdx = dayMap[item.day?.toLowerCase() || ''];
          if (dayIdx !== undefined) {
            const eventDate = new Date(startOfWeekDate);
            eventDate.setDate(startOfWeekDate.getDate() + dayIdx);
            
            addScheduleEvent({
              title: item.title,
              date: format(eventDate, 'yyyy-MM-dd'),
              startTime: item.start,
              endTime: item.end,
              type: 'school',
              room: item.room
            });
          }
        });
        
        // Save group to settings
        updateSettings({ group: selectedGroup });
        setView('daily-routine');
      }
    } catch (error) {
      console.error("Recognition failed:", error);
      // Fallback to next step if recognition fails
      setView('daily-routine');
    } finally {
      setIsRecognizing(false);
    }
  };

  const renderCarousel = () => (
    <div className="flex-1 relative flex flex-col h-full overflow-hidden">
      <div className="flex-1 relative min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex flex-col cursor-grab active:cursor-grabbing"
          >
            {/* Image Container */}
            <div className="h-[55%] w-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Text Container */}
            <div className="flex-1 px-8 pt-6 flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#8B5CF6]">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-2 w-full flex justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-6 bg-primary" : "w-1.5 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-6 pb-8 sm:p-8 sm:pb-12">
        {currentSlide === slides.length - 1 ? (
          <div className="space-y-2 sm:space-y-3">
            <button 
              onClick={() => setView('register')}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 sm:py-4 rounded-xl transition-colors text-base sm:text-lg"
            >
              Зарегистрироваться
            </button>
            <button 
              onClick={() => setView('login')}
              className="w-full bg-surface border border-white/10 hover:bg-white/5 text-white font-bold py-3 sm:py-4 rounded-xl transition-colors text-base sm:text-lg"
            >
              Войти
            </button>

            <div className="relative flex items-center gap-4 py-0.5 sm:py-1">
                <div className="flex-1 h-[1px] bg-white/10"></div>
                <span className="text-gray-500 text-xs sm:text-sm">или</span>
                <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white text-gray-700 font-semibold py-3 sm:py-4 rounded-xl transition-colors hover:bg-gray-100 flex items-center justify-center gap-3 text-sm sm:text-base"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 sm:w-6 sm:h-6" />
                Войти через Google
            </button>
          </div>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full bg-white text-black font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-base sm:text-lg"
          >
            Далее <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img 
          src="https://i.pinimg.com/736x/0f/df/48/0fdf484ccf80ea3301e22e815866f44b.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <button 
        onClick={() => {
            if (showPasswordInput) setShowPasswordInput(false);
            else setView('carousel');
        }}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold text-primary">
              Добро пожаловать
            </h2>
            <p className="text-gray-300 text-lg">
              Начни свой путь вместе с SleamAI
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm text-gray-400 ml-1">Имя</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Иван"
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm text-gray-400 ml-1">Фамилия</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Иванов"
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm text-gray-400 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pr-12"
                />
                <AnimatePresence>
                  {isEmailValid && (
                    <motion.div
                      key="email-valid"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-5 -translate-y-1/2 text-green-500"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!showPasswordInput && (
                <div className="space-y-4">
                     <div className="text-sm text-gray-400 leading-relaxed text-center">
                        Нажимая «Продолжить», вы соглашаетесь с нашей{' '}
                        <a href="#" className="text-primary hover:underline">Политикой конфиденциальности</a>
                        {' '}и{' '}
                        <a href="#" className="text-primary hover:underline">Условиями использования</a>
                    </div>
                    <button
                        onClick={() => isEmailValid && firstName && lastName && setShowPasswordInput(true)}
                        disabled={!isEmailValid || !firstName || !lastName}
                        className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg"
                    >
                        Продолжить
                    </button>
                </div>
            )}

            <AnimatePresence>
              {showPasswordInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Пароль</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Минимум 6 символов..."
                        className={`w-full bg-white/5 backdrop-blur-md border rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors pr-20 ${
                          showPasswordError ? 'border-red-500' : 'border-white/10 focus:border-primary'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                         <button
                           onClick={() => setShowPassword(!showPassword)}
                           className="text-gray-400 hover:text-white transition-colors"
                         >
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                        <AnimatePresence>
                          {isPasswordValid && (
                            <motion.div
                              key="pass-valid"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="text-green-500"
                            >
                              <Check size={20} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <p className={`text-xs ml-1 transition-colors ${showPasswordError ? 'text-red-500' : 'text-gray-400'}`}>
                      Латинские буквы и цифры обязательно. Спецсимволы опционально.
                    </p>
                  </div>

                  <div className="text-sm text-gray-400 leading-relaxed text-center">
                    Нажимая «Создать аккаунт», вы соглашаетесь с нашей{' '}
                    <a href="#" className="text-primary hover:underline">Политикой конфиденциальности</a>
                    {' '}и{' '}
                    <a href="#" className="text-primary hover:underline">Условиями использования</a>
                  </div>

                  {authError && (
                    <p className="text-red-500 text-sm text-center">{authError}</p>
                  )}

                  <motion.button
                    onClick={handleCreateAccount}
                    disabled={isLoading}
                    animate={shakeButton ? { x: [-20, 20, -20, 20, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Создание...
                      </>
                    ) : (
                      'Создать аккаунт'
                    )}
                  </motion.button>

                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                    <span className="text-gray-500 text-sm">или</span>
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                  </div>

                  <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-gray-700 font-semibold py-4 rounded-xl transition-colors hover:bg-gray-100 flex items-center justify-center gap-3 text-base"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    Регистрация через Google
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img 
          src="https://i.pinimg.com/736x/0f/df/48/0fdf484ccf80ea3301e22e815866f44b.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <button 
        onClick={() => setView('carousel')}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold text-primary">
              С возвращением!
            </h2>
            <p className="text-gray-300 text-lg">
              Войдите, чтобы продолжить
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 relative">
              <label className="text-sm text-gray-400 ml-1">Email</label>
              <div className="relative">
                 <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <AnimatePresence>
                  {isLoginEmailValid && (
                    <motion.div
                      key="login-email-valid"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-5 -translate-y-1/2 text-green-500"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!showLoginPasswordInput && (
                <button
                    onClick={() => isLoginEmailValid && setShowLoginPasswordInput(true)}
                    disabled={!isLoginEmailValid}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg"
                >
                    Далее
                </button>
            )}

            <AnimatePresence>
                {showLoginPasswordInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        className="space-y-6 overflow-hidden"
                    >
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400 ml-1">Пароль</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => {
                                  setLoginPassword(e.target.value);
                                  setLoginError(null);
                              }}
                              placeholder="Введите пароль"
                              className={`w-full bg-white/5 backdrop-blur-md border rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors pr-12 ${
                                loginError ? 'border-red-500' : 'border-white/10 focus:border-primary'
                              }`}
                            />
                            <button
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                             >
                               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                             </button>
                          </div>
                          {loginError && (
                              <p className="text-xs text-red-500 ml-1">
                                  {loginError}
                              </p>
                          )}
                        </div>

                        <motion.button
                          onClick={handleLogin}
                          disabled={isLoading}
                          animate={loginShakeButton ? { x: [-20, 20, -20, 20, -10, 10, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg mt-4 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              Вход...
                            </>
                          ) : (
                            'Войти'
                          )}
                        </motion.button>

                        <div className="relative flex items-center gap-4 py-2">
                          <div className="flex-1 h-[1px] bg-white/10"></div>
                          <span className="text-gray-500 text-sm">или</span>
                          <div className="flex-1 h-[1px] bg-white/10"></div>
                        </div>

                        <button 
                          onClick={handleGoogleLogin}
                          className="w-full bg-white text-gray-700 font-semibold py-4 rounded-xl transition-colors hover:bg-gray-100 flex items-center justify-center gap-3 text-base"
                        >
                          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                          Войти через Google
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderVerifyEmail = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img 
          src="https://i.pinimg.com/736x/0f/df/48/0fdf484ccf80ea3301e22e815866f44b.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-20 relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white">Почти готово!</h2>
          <p className="text-gray-300 leading-relaxed">
            Мы отправили письмо для подтверждения на <span className="text-primary font-semibold">{email}</span>. 
            Пожалуйста, перейдите по ссылке в письме, чтобы активировать свой аккаунт.
          </p>
          <div className="space-y-4 pt-4">
            <button
              onClick={() => setView('login')}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg"
            >
              Перейти к входу
            </button>
            <p className="text-xs text-gray-500">
              Не получили письмо? Проверьте папку «Спам» или подождите несколько минут.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderProgressBar = () => {
    const info = getStepInfo();
    if (!info) return null;

    const totalSteps = info.total;
    const currentStep = info.step;

    return (
      <div className="absolute bottom-8 left-4 right-4 z-30 flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum <= currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div 
                key={index} 
                className={clsx(
                    "flex items-center", 
                    index === totalSteps - 1 ? "flex-none" : "flex-1"
                )}
            >
              {/* Circle */}
              <motion.div 
                animate={{
                    backgroundColor: isActive ? "#8b5cf6" : "rgba(255,255,255,0.1)", // purple-500 or white/10
                    scale: isActive ? 1.1 : 1,
                    borderColor: isActive ? "#8b5cf6" : "rgba(255,255,255,0.2)"
                }}
                className={clsx(
                    "w-3 h-3 rounded-full border transition-colors duration-300 flex-shrink-0 z-10",
                    // isActive ? "bg-primary border-primary" : "bg-white/10 border-white/20" // handled by motion
                )}
              />
              
              {/* Line (after the circle) */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-[2px] mx-0 bg-white/10 relative w-full overflow-hidden">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-y-0 left-0 bg-primary"
                    />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderNameInput = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-30" />
        <div className="absolute inset-0 bg-purple-900/80 mix-blend-multiply z-20" />
        <div className="absolute inset-0 bg-purple-600/50 mix-blend-color z-20" />
        <div className="absolute inset-0 bg-purple-500/30 mix-blend-overlay z-20" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover grayscale"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      <button 
        onClick={handleBack}
        className="absolute top-8 left-4 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col pb-20 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold text-primary">
              Расскажите о себе
            </h2>
            <p className="text-gray-300 text-lg">
              Как к вам обращаться?
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Имя</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Фамилия</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ваша фамилия"
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* School Shift Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-sm text-gray-400 ml-1">Смена в школе</label>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSchoolShift('1');
                    setSchoolStartTime('08:00');
                    setSchoolEndTime('14:00');
                  }}
                  className={clsx(
                    "flex-1 py-3 rounded-xl border transition-all font-medium",
                    schoolShift === '1' 
                      ? "bg-primary text-white border-primary" 
                      : "bg-white/5 backdrop-blur-md border-white/10 text-gray-400 hover:bg-white/10"
                  )}
                >
                  1 смена
                </button>
                <button
                  onClick={() => {
                    setSchoolShift('2');
                    setSchoolStartTime('14:00');
                    setSchoolEndTime('19:00');
                  }}
                  className={clsx(
                    "flex-1 py-3 rounded-xl border transition-all font-medium",
                    schoolShift === '2' 
                      ? "bg-primary text-white border-primary" 
                      : "bg-white/5 backdrop-blur-md border-white/10 text-gray-400 hover:bg-white/10"
                  )}
                >
                  2 смена
                </button>
              </div>
            </div>

            {/* School Hours */}
            <AnimatePresence>
                {schoolShift && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 overflow-hidden"
                    >
                         <div className="flex gap-4">
                            <div className="flex-1">
                                <TimePicker 
                                label="Начало уроков" 
                                value={schoolStartTime} 
                                onChange={setSchoolStartTime} 
                                />
                            </div>
                            <div className="flex-1">
                                <TimePicker 
                                label="Конец уроков" 
                                value={schoolEndTime} 
                                onChange={setSchoolEndTime} 
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Время в пути до школы (мин)</label>
              <input
                type="number"
                value={commuteTime}
                onChange={(e) => setCommuteTime(e.target.value)}
                placeholder="Например: 30"
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              onClick={handleNameSubmit}
              disabled={!firstName || !lastName || !schoolShift}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg mt-4"
            >
              Далее
            </button>
          </div>
        </motion.div>
      </div>
      {renderProgressBar()}
    </div>
  );

  const renderActivityInput = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-30" />
        <div className="absolute inset-0 bg-purple-900/80 mix-blend-multiply z-20" />
        <div className="absolute inset-0 bg-purple-600/50 mix-blend-color z-20" />
        <div className="absolute inset-0 bg-purple-500/30 mix-blend-overlay z-20" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover grayscale"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      <button 
        onClick={handleBack}
        className="absolute top-8 left-4 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col pb-20 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-primary">
              Ваше расписание
            </h2>
            <p className="text-gray-300 text-lg">
              Добавьте кружки, секции, курсы или куда уходит часть вашего времени
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Название активности</label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Например: Подготовка к IELTS"
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <TimePicker 
                  label="Начало" 
                  value={startTime} 
                  onChange={setStartTime} 
                />
              </div>
              <div className="flex-1">
                <TimePicker 
                  label="Конец" 
                  value={endTime} 
                  onChange={setEndTime} 
                />
              </div>
            </div>

            {/* Days Selection */}
            <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Дни недели</label>
                <div className="flex justify-between gap-1">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => (
                        <button
                            key={idx}
                            onClick={() => toggleDay(idx)}
                            className={clsx(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                                selectedDays.includes(idx)
                                    ? "bg-primary text-white"
                                    : "bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:bg-white/10"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            <button
              onClick={handleAddActivity}
              disabled={!activityName || !startTime || !endTime || selectedDays.length === 0}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Добавить
            </button>
          </div>

          {/* Activity List */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
            <AnimatePresence>
                {activities.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex justify-between items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                    >
                        <div>
                            <div className="font-medium text-white">{activity.title}</div>
                            <div className="text-sm text-gray-400">
                                {activity.startTime} - {activity.endTime} • {
                                    activity.days.map(d => ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][d]).join(', ')
                                }
                            </div>
                        </div>
                        <button 
                            onClick={() => handleRemoveActivity(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCompleteOnboarding}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg mt-4 relative z-50 cursor-pointer active:scale-95"
          >
            Далее
          </button>
        </motion.div>
      </div>
      {renderProgressBar()}
    </div>
  );

  const renderStep3 = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
        {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-30" />
        <div className="absolute inset-0 bg-purple-900/80 mix-blend-multiply z-20" />
        <div className="absolute inset-0 bg-purple-600/50 mix-blend-color z-20" />
        <div className="absolute inset-0 bg-purple-500/30 mix-blend-overlay z-20" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover grayscale"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      <button 
        onClick={handleBack}
        className="absolute top-8 left-4 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>
      
      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col pb-20 pt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-primary">
                Загрузите расписание
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
                Сфотографируйте или загрузите скриншот вашего расписания. ИИ распознает его автоматически.
            </p>
          </div>

          {/* Group Selection */}
          <div className="mb-6 space-y-3">
            <label className="text-sm text-gray-400 ml-1">Выберите вашу группу</label>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedGroup('1 группа')}
                className={clsx(
                  "flex-1 py-3 rounded-xl border transition-all font-medium",
                  selectedGroup === '1 группа' 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white/5 backdrop-blur-md border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                1 ГРУППА
              </button>
              <button
                onClick={() => setSelectedGroup('2 группа')}
                className={clsx(
                  "flex-1 py-3 rounded-xl border transition-all font-medium",
                  selectedGroup === '2 группа' 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white/5 backdrop-blur-md border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                2 ГРУППА
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center mb-8">
            <AnimatePresence mode="wait">
                {!scheduleImage ? (
                    <motion.label 
                        key="upload"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="text-white w-8 h-8" />
                        </div>
                        <span className="text-gray-400 font-medium group-hover:text-white transition-colors">
                            Нажмите, чтобы загрузить
                        </span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                        />
                    </motion.label>
                ) : (
                    <motion.div 
                        key="preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative group border border-white/20"
                    >
                        <img 
                            src={scheduleImage} 
                            alt="Schedule Preview" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => {
                                  setScheduleImage(null);
                                  setScheduleImageFile(null);
                                }}
                                className="bg-red-500/80 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Удалить
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleRecognizeSchedule}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg mb-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            disabled={!scheduleImage || isRecognizing}
          >
            {isRecognizing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                />
                Распознавание...
              </>
            ) : (
              'Распознать и продолжить'
            )}
          </button>
      </div>
      {renderProgressBar()}
    </div>
  );

  const renderDailyRoutine = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-purple-900/80 mix-blend-multiply z-20" />
        <div className="absolute inset-0 bg-purple-600/50 mix-blend-color z-20" />
        <div className="absolute inset-0 bg-purple-500/30 mix-blend-overlay z-20" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover grayscale"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      <button 
        onClick={handleBack}
        className="absolute top-8 left-4 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col pb-20 pt-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-3 text-primary">
              Ваш режим дня
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
              Настройте время для основных событий дня
          </p>
        </div>

        <div className="flex-1 flex flex-col space-y-4 mb-8">
            <TimePicker label="Подъем" value={wakeUpTime} onChange={setWakeUpTime} />
            <TimePicker label="Завтрак" value={breakfastTime} onChange={setBreakfastTime} />
            <TimePicker label="Обед" value={lunchTime} onChange={setLunchTime} />
            <TimePicker label="Ужин" value={dinnerTime} onChange={setDinnerTime} />
            <TimePicker label="Сон" value={bedTime} onChange={setBedTime} />
        </div>

        <button 
          onClick={handleCompleteDailyRoutine}
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg mb-8"
        >
          Далее
        </button>
      </div>
      {renderProgressBar()}
    </div>
  );

  const renderCompletion = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-y-auto custom-scrollbar text-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={200}
        recycle={false}
        gravity={0.15}
        initialVelocityY={20}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-sm mx-auto space-y-8 flex flex-col items-center pt-12 pb-20"
      >
        <motion.div 
             initial={{ scale: 0, opacity: 0, y: -50 }}
             animate={{ 
                 scale: 1, 
                 opacity: 1, 
                 y: 0
             }}
             transition={{ 
                 type: "spring",
                 stiffness: 200,
                 damping: 10,
                 duration: 0.8,
                 delay: 0.2
             }}
             className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 mb-4"
         >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
             <Check size={48} className="text-white" />
          </motion.div>
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Готово!</h2>
          <p className="text-gray-300 text-lg">
            Регистрация успешно завершена. <br/>
            Твой персональный план готов.
          </p>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
            От тебя нужно лишь записывать домашнее задание и заранее сообщать о предстоящих экзаменах, СОР/СОЧ.
          </p>
        </div>

        <button 
          onClick={handleFinishOnboarding}
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg shadow-lg shadow-primary/20 mt-8"
        >
          Приступить
        </button>
      </motion.div>
      {renderProgressBar()}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {view === 'carousel' && renderCarousel()}
      {view === 'register' && renderRegister()}
      {view === 'login' && renderLogin()}
      {view === 'verify-email' && renderVerifyEmail()}
      {view === 'name-input' && renderNameInput()}
      {view === 'activity-input' && renderActivityInput()}
      {view === 'step-3' && renderStep3()}
      {view === 'daily-routine' && renderDailyRoutine()}
      {view === 'completion' && renderCompletion()}
    </div>
  );
};
