import {
  Bell,
  ChevronRight,
  Flame,
  Target,
  FileText,
  Sparkles,
  LogOut,
  User,
  Check,
  Trophy,
  Clock,
  MessageSquare,
  Star,
  School,
  Image as ImageIcon,
  Loader2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState, useRef } from 'react';
import { DailyRoutineModal } from '../components/DailyRoutineModal';
import { SchoolTimetableModal } from '../components/SchoolTimetableModal';
import { recognizeScheduleFromImage } from '../services/geminiService';
import { format, startOfWeek, addDays, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '../services/supabase';

export const Profile = () => {
  const { 
    user, 
    logout, 
    setNotificationsOpen, 
    tasks, 
    notes, 
    settings, 
    addScheduleEvent, 
    updateSettings, 
    clearSchoolSchedule,
    streak 
  } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState(settings.grade || '');
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isDailyRoutineOpen, setIsDailyRoutineOpen] = useState(false);
  const [isSchoolTimetableOpen, setIsSchoolTimetableOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionSuccess, setRecognitionSuccess] = useState(false);
  const [tempGroup, setTempGroup] = useState(settings.group || '');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendFeedback = async () => {
    if (!feedback.trim() || rating === 0) return;

    setIsSendingFeedback(true);
    try {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('feedback').insert([
        { 
          user_id: sbUser?.id,
          rating, 
          content: feedback,
          user_name: user ? `${user.name} ${user.surname}` : 'Anonymous'
        }
      ]);

      if (error) throw error;

      setFeedbackSuccess(true);
      setFeedback('');
      setRating(0);
      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Не удалось отправить отзыв. Попробуйте позже.');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleGroupSelect = (group: string) => {
    setTempGroup(group);
    updateSettings({ group });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!tempGroup.trim()) {
      alert('Пожалуйста, укажите вашу группу перед загрузкой расписания');
      return;
    }

    setIsRecognizing(true);
    setRecognitionSuccess(false);
    
    try {
      // Очищаем старое школьное расписание перед загрузкой нового
      clearSchoolSchedule();
      
      const recognizedItems = await recognizeScheduleFromImage(file, tempGroup);
      
      // Карта дней недели для расчета дат
      const dayMap: Record<string, number> = {
        'понедельник': 0,
        'вторник': 1,
        'среда': 2,
        'четверг': 3,
        'пятница': 4,
        'суббота': 5,
        'воскресенье': 6
      };

      // Получаем начало текущей недели (понедельник)
      const currentStartOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      
      // Добавляем каждый предмет в расписание
      recognizedItems.forEach(item => {
        let eventDate = format(new Date(), 'yyyy-MM-dd'); // По умолчанию сегодня
        
        if (item.day) {
          const dayIndex = dayMap[item.day.toLowerCase()];
          if (dayIndex !== undefined) {
            const targetDate = addDays(currentStartOfWeek, dayIndex);
            eventDate = format(targetDate, 'yyyy-MM-dd');
          }
        }

        addScheduleEvent({
          title: item.title,
          date: eventDate,
          startTime: item.start,
          endTime: item.end,
          type: 'school',
          room: item.room,
          subtasks: []
        });
      });
      
      setRecognitionSuccess(true);
      setTimeout(() => setRecognitionSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to recognize schedule:', error);
      alert('Не удалось распознать расписание. Попробуйте другое фото.');
    } finally {
      setIsRecognizing(false);
    }
  };

  const completedTasks = tasks.filter(t => t.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-32"
    >
      <DailyRoutineModal 
        isOpen={isDailyRoutineOpen} 
        onClose={() => setIsDailyRoutineOpen(false)} 
      />
      <SchoolTimetableModal 
        isOpen={isSchoolTimetableOpen} 
        onClose={() => setIsSchoolTimetableOpen(false)} 
      />
      {/* Header */}
      <header className="flex justify-between items-center pt-2 px-1">
        <div className="flex gap-3 items-center">
          <img src="/logotype.png" alt="SleamAI Logo" className="w-20 h-20 object-contain" />
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

      {/* Page Title */}
      <h2 className="text-2xl font-bold px-1">Профиль</h2>

      {/* User Card */}
      <div className="bg-[#18181B]/50 backdrop-blur-md p-5 rounded-3xl border border-white/10 relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

         <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <User className="w-8 h-8 text-white" />
            </div>
            <div>
                <h3 className="text-xl font-bold">
                  {user ? `${user.name} ${user.surname}` : 'Гость'}
                </h3>
                <p className="text-sm text-gray-400">10 класс • {settings.group || 'Группа не указана'}</p>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="flex flex-col items-center gap-1">
                <Flame className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-lg font-bold">{streak} {streak === 1 ? 'день' : streak > 1 && streak < 5 ? 'дня' : 'дней'}</span>
                <span className="text-[10px] text-gray-500 font-medium">Streak</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-white/5">
                <Target className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-lg font-bold">{completedTasks}</span>
                <span className="text-[10px] text-gray-500 font-medium">Задач</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <FileText className="w-5 h-5 text-purple-400 mb-1" />
                <span className="text-lg font-bold">{notes.length}</span>
                <span className="text-[10px] text-gray-500 font-medium">Конспектов</span>
            </div>
         </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-[#18181B]/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
            <h3 className="font-bold mb-1">ИИ-анализ</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
                Ты создал {notes.length} конспектов за этот месяц! Это на 40% больше, чем в прошлом. Так держать! 🎯
            </p>
        </div>
      </div>

      {/* Group & Schedule Recognition Card */}
      <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-md p-6 rounded-3xl border border-purple-500/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ImageIcon className="w-20 h-20 text-white" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Расписание по фото</h3>
              <p className="text-[10px] text-purple-200/70">Загрузи фото, и SleamAI всё сделает</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Твоя группа / класс</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleGroupSelect('1 группа')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${tempGroup === '1 группа' ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400 border border-purple-500/20'}`}
                >
                  1 ГРУППА
                </button>
                <button 
                  onClick={() => handleGroupSelect('2 группа')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${tempGroup === '2 группа' ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400 border border-purple-500/20'}`}
                >
                  2 ГРУППА
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <input 
                type="text"
                value={tempGroup}
                onChange={(e) => {
                  setTempGroup(e.target.value);
                  updateSettings({ group: e.target.value });
                }}
                placeholder="Например: ПИ-21 или 1 группа"
                className="w-full bg-white/5 border border-purple-500/30 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecognizing}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              recognitionSuccess 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-black hover:bg-gray-100 shadow-xl shadow-black/10'
            }`}
          >
            {isRecognizing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Распознаём...</span>
              </>
            ) : recognitionSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>Готово!</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                <span>Загрузить фото</span>
              </>
            )}
          </button>
          
          {recognitionSuccess && (
            <p className="text-center text-[10px] text-green-400 mt-2 font-medium animate-pulse">
              Предметы на неделю добавлены в ваше расписание!
            </p>
          )}
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-2">
        {/* Notifications */}
        <div className="bg-[#18181B]/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3 text-left">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                    <div className="font-medium">Уведомления</div>
                    <div className="text-[10px] text-gray-500">Напоминания о дедлайнах</div>
                </div>
            </div>
            <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notificationsEnabled ? 'bg-[#8B5CF6]' : 'bg-gray-600'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
            </button>
        </div>

        {/* School & Grade (Expandable) - Hidden temporarily */}
        {/* <div className="bg-[#18181B]/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
            <button 
                onClick={() => setIsStudyOpen(!isStudyOpen)}
                className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3 text-left">
                    <div className="w-5 h-5 flex items-center justify-center">
                        <School className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <div className="font-medium">Учеба</div>
                        <div className="text-[10px] text-gray-500">
                            {school && grade ? `${school}, ${grade} класс` : 'Укажи свою школу и класс'}
                        </div>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isStudyOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isStudyOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-4 pb-4 pt-0 space-y-3">
                            <div className="h-[1px] bg-white/5 mb-3" />
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 ml-1">Название школы</label>
                                    <input 
                                        type="text" 
                                        placeholder="Школа"
                                        value={school}
                                        onChange={(e) => setSchool(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 ml-1">Класс</label>
                                    <input 
                                        type="text" 
                                        placeholder="Класс"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div> */}

        {/* Daily Routine */}
        <button 
            onClick={() => setIsDailyRoutineOpen(true)}
            className="w-full bg-[#18181B]/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex justify-between items-center group transition-colors hover:bg-white/5"
        >
            <div className="flex items-center gap-3 text-left">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                    <div className="font-medium">Режим дня</div>
                    <div className="text-[10px] text-gray-500">
                        {settings.wakeUpTime} - {settings.bedTime} • Дорога: {settings.commuteTime} мин
                    </div>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </button>

        {/* School Timetable */}
        <button 
            onClick={() => setIsSchoolTimetableOpen(true)}
            className="w-full bg-[#18181B]/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex justify-between items-center group transition-colors hover:bg-white/5"
        >
            <div className="flex items-center gap-3 text-left">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                    <div className="font-medium">Расписание звонков</div>
                    <div className="text-[10px] text-gray-500">
                        {settings.schoolTimetable?.length || 0} уроков • Настройка длительности
                    </div>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex justify-between items-center px-1 mb-3">
            <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Достижения</h3>
            </div>
            <span className="text-xs text-gray-500">2/3</span>
        </div>

        <div className="space-y-2">
            {/* Achievement 1 */}
            <div className="bg-[#18181B]/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" strokeWidth={3} />
                    </div>
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-sm">Первый конспект</h4>
                    <p className="text-xs text-gray-500">Создал первый конспект с ИИ</p>
                </div>
            </div>

            {/* Achievement 2 */}
            <div className="bg-[#18181B]/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" strokeWidth={3} />
                    </div>
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-sm">Неделя без пропусков</h4>
                    <p className="text-xs text-gray-500">7 дней подряд заходил в приложение</p>
                </div>
            </div>

            {/* Achievement 3 (Locked) */}
            <div className="bg-[#18181B]/30 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4 opacity-70">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                     <Trophy className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-sm text-gray-400">Мастер дедлайнов</h4>
                    <p className="text-xs text-gray-600">Выполнил 10 задач вовремя</p>
                </div>
            </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-[#18181B]/50 backdrop-blur-md p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
                <h3 className="font-bold">Обратная связь</h3>
                <p className="text-[10px] text-gray-500">Помоги нам стать лучше</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                    >
                        <Star 
                            className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
                        />
                    </button>
                ))}
            </div>

            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Чего тебе не хватает в приложении? Пиши сюда..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none transition-all"
            />

            <button
                onClick={handleSendFeedback}
                disabled={!feedback.trim() || rating === 0 || isSendingFeedback}
                className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    feedback.trim() && rating !== 0 && !isSendingFeedback
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
            >
                {isSendingFeedback ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Отправка...
                    </>
                ) : feedbackSuccess ? (
                    <>
                        <Check size={18} className="text-green-400" />
                        Отправлено!
                    </>
                ) : (
                    'Отправить отзыв'
                )}
            </button>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full p-4 rounded-2xl bg-[#18181B]/50 backdrop-blur-md border border-white/10 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/20 active:scale-[0.98] transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Выйти</span>
      </button>
    </motion.div>
  );
};
