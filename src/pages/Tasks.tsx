import { motion } from 'framer-motion';
import { Sparkles, Bell, Plus, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, differenceInDays, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export const Tasks = () => {
  const { tasks, removeTask, toggleTask, setNotificationsOpen, setAddTaskOpen } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'done') return task.isCompleted;
    return true;
  });

  const getTaskStatus = (deadline?: string) => {
    if (!deadline) return { colorClass: 'border-white/5', daysLeft: 999, label: '' };
    
    const daysLeft = differenceInDays(parseISO(deadline), startOfDay(new Date()));
    
    let label = '';
    if (daysLeft < 0) label = 'Просрочено';
    else if (daysLeft === 0) label = 'Сегодня';
    else if (daysLeft === 1) label = 'Завтра';
    else label = `${daysLeft} дн.`;

    if (daysLeft < 0) {
      return { 
        colorClass: 'border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]', 
        badgeClass: 'bg-red-500/10 border-red-500/20 text-red-400',
        daysLeft, 
        label 
      };
    }
    if (daysLeft <= 3) {
      return { 
        colorClass: 'border-[#8B5CF6]/50 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]', 
        badgeClass: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#A78BFA]',
        daysLeft, 
        label 
      };
    }
    if (daysLeft < 5) {
      return { 
        colorClass: 'border-yellow-500/50 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]', 
        badgeClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        daysLeft, 
        label 
      };
    }
    
    return { 
      colorClass: 'border-green-500/50 shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]', 
      badgeClass: 'bg-green-500/10 border-green-500/20 text-green-400',
      daysLeft, 
      label 
    };
  };

  const getDeadlineText = (deadline?: string) => {
    if (!deadline) return '';
    try {
      return format(parseISO(deadline), 'd MMM', { locale: ru });
    } catch (e) {
      return deadline;
    }
  };

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
        <button 
          onClick={() => setNotificationsOpen(true)}
          className="p-2 rounded-full bg-[#18181B] hover:bg-[#27272A] transition-colors border border-white/5 relative"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full ring-2 ring-[#18181B]"></div>
        </button>
      </header>

      {/* Page Title & Stats */}
      <div className="flex justify-between items-start px-1">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Дедлайны</h2>
          <p className="text-sm text-gray-400">
            {tasks.filter(t => !t.isCompleted).length} активных • {tasks.filter(t => t.isCompleted).length} выполнено
          </p>
        </div>
        <button 
          onClick={() => setAddTaskOpen(true)}
          className="w-10 h-10 rounded-full bg-[#8B5CF6] hover:bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/30 transition-colors"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-1">
        {[
          { label: 'Все', value: 'all' },
          { label: 'Активные', value: 'active' },
          { label: 'Готово', value: 'done' }
        ].map((tab) => {
           const isActive = filter === tab.value;
           return (
             <button
               key={tab.value}
               onClick={() => setFilter(tab.value as any)}
               className={clsx(
                 "px-5 py-2 rounded-full text-sm font-medium transition-colors",
                 isActive 
                   ? "bg-white text-black" 
                   : "text-gray-400 hover:text-white hover:bg-white/5"
               )}
             >
               {tab.label}
             </button>
           );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-3 px-1">
        {filteredTasks.map((task) => {
          const status = getTaskStatus(task.deadline);
          return (
            <div 
              key={task.id}
              className={clsx(
                "relative p-4 rounded-3xl border transition-all bg-[#0f0f13] group",
                task.isCompleted ? "bg-green-700/10 border-green-300/10" : status.colorClass,
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="text-gray-500 hover:text-[#8B5CF6] transition-colors"
                  >
                    {task.isCompleted 
                      ? <CheckCircle2 className="w-6 h-6 text-green-500" /> 
                      : <Circle className="w-6 h-6 text-purple-400/50" />
                    }
                  </button>
                  
                  <div className="flex flex-col">
                    <h3 className={clsx(
                      "font-bold text-lg leading-tight mb-1", 
                      task.isCompleted ? "text-gray-500 line-through" : "text-white"
                    )}>
                      {task.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-3 h-3 border-l border-b border-gray-600 rounded-bl-[4px] -mt-1 ml-0.5"></div>
                      <p className={clsx(
                        "text-sm font-medium",
                        task.isCompleted && "line-through text-gray-600"
                      )}>
                        {task.title}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                    task.isCompleted ? "bg-green-500/10 border-green-500/20 text-green-400" : status.badgeClass
                  )}>
                    <Clock className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                  
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="p-2 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">Задач не найдено</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
