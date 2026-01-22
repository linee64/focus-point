import { useState } from 'react';
import { Bell, BookOpen, Clock, CheckCircle2, MapPin, Smile, Meh, Frown, Sparkles, Target, Plus, Check, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Notifications } from '../components/Notifications';
import { AddTaskModal } from '../components/AddTaskModal';
import { clsx } from 'clsx';
import { format, parseISO, differenceInDays, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export const Dashboard = () => {
  const { 
    tasks,
    removeTask,
    isNotificationsOpen, 
    setNotificationsOpen, 
    isAddTaskOpen, 
    setAddTaskOpen,
    schedule 
  } = useStore();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayDate = new Date();
  const todaySchedule = schedule
    .filter(e => e.date === todayStr && e.type === 'school')
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const activeTasks = tasks.filter(t => !t.isCompleted).slice(0, 3);

  const getDeadlineInfo = (deadline?: string) => {
    if (!deadline) return null;
    const date = parseISO(deadline);
    const daysLeft = differenceInDays(date, startOfDay(todayDate));
    
    let label = `${daysLeft} дней`;
    if (daysLeft === 0) label = 'Сегодня';
    if (daysLeft === 1) label = 'Завтра';
    if (daysLeft < 0) label = 'Просрочено';

    let colorClass = 'border-white/5';
    let badgeClass = 'text-blue-400';

    if (daysLeft < 0) {
      colorClass = 'border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]';
      badgeClass = 'text-red-400';
    } else if (daysLeft <= 3) {
      colorClass = 'border-[#8B5CF6]/50 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]';
      badgeClass = 'text-[#A78BFA]';
    } else if (daysLeft < 5) {
      colorClass = 'border-yellow-500/50 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]';
      badgeClass = 'text-yellow-400';
    } else {
      colorClass = 'border-green-500/50 shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]';
      badgeClass = 'text-green-400';
    }

    return {
      date: format(date, 'd MMM', { locale: ru }),
      label,
      daysLeft,
      colorClass,
      badgeClass
    };
  };

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMoodSelect = (mood: string) => {
    if (isSubmitted) return;
    setSelectedMood(mood);
  };

  const handleCheckIn = () => {
    if (!selectedMood || isSubmitting || isSubmitted) return;
    
    setIsSubmitting(true);
    // Имитация отправки на сервер
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const isWeekend = [0, 6].includes(todayDate.getDay());

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header className="flex justify-between items-center pt-2 px-1">
        <div className="flex gap-3 items-center">
          <img src="/logotype.png" alt="SleamAI Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-[#8B5CF6]">SleamAI</h1>
            <p className="text-xs text-gray-400 capitalize">
              {format(todayDate, 'EEEE, d MMMM', { locale: ru })}
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

      {/* Today Stats */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-white/90">
          <span className="text-amber-400">⚡</span>
          <h2 className="font-bold">Сегодня</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Уроков</span>
            <span className="text-xl font-bold text-white">{todaySchedule.filter(e => e.type === 'school').length}</span>
          </div>
          
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Событий</span>
            <span className="text-xl font-bold text-white">{todaySchedule.length}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Задач</span>
            <span className="text-xl font-bold text-white">
              {tasks.filter(t => t.isCompleted).length}/{tasks.length}
            </span>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold">Расписание</h2>
          </div>
          <span className="text-xs text-gray-500">{todaySchedule.length} событий</span>
        </div>

        <div className="space-y-2">
          {todaySchedule.length > 0 ? (
            todaySchedule.map((event) => {
              const now = format(new Date(), 'HH:mm');
              const isCurrent = now >= event.startTime && now <= event.endTime;
              const isPast = now > event.endTime;

              return (
                <div 
                  key={event.id}
                  className={clsx(
                    "p-4 rounded-2xl border transition-all relative overflow-hidden",
                    isCurrent 
                      ? "bg-[#212129] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                      : "bg-white/5 border-white/5"
                  )}
                >
                  <div className={clsx(
                    "absolute left-0 top-3 bottom-3 w-1 rounded-r-full",
                    isCurrent ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" : 
                    isPast ? "bg-green-500" : 
                    event.type === 'routine' ? "bg-blue-400" :
                    event.type === 'activity' ? "bg-orange-400" : "bg-white/20"
                  )}></div>
                  
                  <div className="flex justify-between items-center pl-3">
                    <div>
                      <h3 className={clsx(
                        "font-bold",
                        isCurrent ? "text-white text-lg" : 
                        isPast ? "text-gray-500 line-through decoration-gray-600" : "text-white"
                      )}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{event.startTime}{event.endTime && event.endTime !== event.startTime ? ` - ${event.endTime}` : ''}</span>
                        {event.type === 'school' && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>Каб. {event.room || '—'}</span>
                            </div>
                          )}
                      </div>
                    </div>
                    
                    {isCurrent ? (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                        Сейчас
                      </span>
                    ) : isPast ? (
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-sm text-gray-500 italic">На сегодня расписание пусто</p>
              <p className="text-[10px] text-gray-600 mt-1">Добавьте уроки в разделе «Расписание» или загрузите фото в профиле</p>
            </div>
          )}
        </div>
      </section>

      {/* Deadlines */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-white/90">
            <Target className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold">Дедлайны</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setAddTaskOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Добавить
            </button>
            <span className="text-xs text-gray-500">{tasks.filter(t => !t.isCompleted).length} задач</span>
          </div>
        </div>

        <div className="space-y-3">
          {activeTasks.map((task) => {
            const info = getDeadlineInfo(task.deadline);
            return (
              <div key={task.id} className={clsx(
                "bg-white/5 p-4 rounded-2xl border transition-all relative overflow-hidden group",
                info?.colorClass || "border-white/5"
              )}>
                <div className="flex justify-between items-center">
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      "w-1.5 h-1.5 rounded-full mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]",
                      task.type === 'exam' ? 'bg-red-500' : 
                      task.type === 'project' ? 'bg-blue-500' : 'bg-orange-500'
                    )}></div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-white text-base leading-tight mb-0.5">{task.subject}</h3>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <div className="w-2.5 h-2.5 border-l border-b border-gray-700 rounded-bl-[3px] -mt-1 ml-0.5"></div>
                        <p className="text-xs font-medium truncate max-w-[140px]">{task.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className={clsx(
                        "text-xs font-bold",
                        info?.badgeClass
                      )}>
                        {info?.label}
                      </span>
                      <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        Дедлайн
                      </span>
                    </div>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="p-2 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {activeTasks.length === 0 && (
            <div className="py-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
              <p className="text-sm text-gray-500">Нет активных задач</p>
            </div>
          )}
        </div>
      </section>



      {/* Daily Check-in */}
      <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-4">
        <h3 className="text-center font-bold text-white">Как прошёл день?</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleMoodSelect('easy')}
            disabled={isSubmitted}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
              selectedMood === 'easy' 
                ? "bg-green-500/20 border-green-500/50" 
                : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
          >
            <Smile className={clsx(
              "w-8 h-8 transition-transform duration-300",
              selectedMood === 'easy' ? "text-green-400 scale-110" : "text-green-500/60 group-hover:text-green-500"
            )} />
            <span className={clsx(
              "text-xs font-medium transition-colors",
              selectedMood === 'easy' ? "text-green-400" : "text-gray-500 group-hover:text-green-500"
            )}>Легко</span>
          </button>
          
          <button 
            onClick={() => handleMoodSelect('normal')}
            disabled={isSubmitted}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
              selectedMood === 'normal' 
                ? "bg-blue-500/20 border-blue-500/50" 
                : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
          >
            <Meh className={clsx(
              "w-8 h-8 transition-transform duration-300",
              selectedMood === 'normal' ? "text-blue-400 scale-110" : "text-blue-500/60 group-hover:text-blue-500"
            )} />
            <span className={clsx(
              "text-xs font-medium transition-colors",
              selectedMood === 'normal' ? "text-blue-400" : "text-gray-500 group-hover:text-blue-500"
            )}>Нормально</span>
          </button>
          
          <button 
            onClick={() => handleMoodSelect('hard')}
            disabled={isSubmitted}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
              selectedMood === 'hard' 
                ? "bg-orange-500/20 border-orange-500/50" 
                : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
          >
            <Frown className={clsx(
              "w-8 h-8 transition-transform duration-300",
              selectedMood === 'hard' ? "text-orange-400 scale-110" : "text-orange-500/60 group-hover:text-orange-500"
            )} />
            <span className={clsx(
              "text-xs font-medium transition-colors",
              selectedMood === 'hard' ? "text-orange-400" : "text-gray-500 group-hover:text-orange-500"
            )}>Тяжело</span>
          </button>
        </div>

        <button 
          onClick={handleCheckIn}
          disabled={!selectedMood || isSubmitting || isSubmitted}
          className={clsx(
            "w-full font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
            isSubmitted 
              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
              : selectedMood 
                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover" 
                : "bg-white/5 text-gray-500 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isSubmitted ? (
            <>
              <Check size={18} />
              Принято
            </>
          ) : (
            'Отправить'
          )}
        </button>
      </section>

      <Notifications isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AddTaskModal isOpen={isAddTaskOpen} onClose={() => setAddTaskOpen(false)} />
    </div>
  );
};
