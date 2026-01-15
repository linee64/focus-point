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
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { DailyRoutineModal } from '../components/DailyRoutineModal';

export const Profile = () => {
  const { logout, setNotificationsOpen, tasks, notes, settings } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isDailyRoutineOpen, setIsDailyRoutineOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const completedTasks = tasks.filter(t => t.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      <DailyRoutineModal 
        isOpen={isDailyRoutineOpen} 
        onClose={() => setIsDailyRoutineOpen(false)} 
      />
      {/* Header */}
      <header className="flex justify-between items-center pt-2 px-1">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#8B5CF6]">SleamAI</h1>
            <p className="text-xs text-gray-400">Суббота, 3 Января</p>
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
                <h3 className="text-xl font-bold">Александр</h3>
                <p className="text-sm text-gray-400">10 класс • Гимназия №5</p>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="flex flex-col items-center gap-1">
                <Flame className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-lg font-bold">5 дней</span>
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

        {/* School & Grade (Expandable) */}
        <div className="bg-[#18181B]/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
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
        </div>

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
                disabled={!feedback.trim() || rating === 0}
                className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] ${
                    feedback.trim() && rating !== 0
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
            >
                Отправить отзыв
            </button>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full p-4 rounded-2xl bg-[#18181B]/50 backdrop-blur-md border border-white/10 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Выйти</span>
      </button>
    </motion.div>
  );
};
