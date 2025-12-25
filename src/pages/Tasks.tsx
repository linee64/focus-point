import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Plus, CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';

export const Tasks = () => {
  const { tasks, toggleTask } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Дедлайны</h1>
        <button className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
          <Plus size={20} />
        </button>
      </header>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => toggleTask(task.id)}
          >
            <div className="flex items-center gap-3">
              <button className={clsx("transition-colors", task.isCompleted ? "text-primary" : "text-gray-500 group-hover:text-primary-light")}>
                {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <div>
                <h4 className={clsx("font-medium transition-all", task.isCompleted && "line-through text-gray-500")}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 uppercase tracking-wide">
                    {task.type}
                  </span>
                  {task.deadline && (
                    <span className="text-xs text-gray-500">
                      Срок: {format(parseISO(task.deadline), 'dd.MM')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {task.spacedRepetition && (
               <div className="flex flex-col items-end">
                 <span className="text-[10px] text-gray-400">Повтор</span>
                 <div className="flex gap-0.5 mt-1">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className={clsx(
                       "w-1.5 h-1.5 rounded-full",
                       i < task.spacedRepetition!.level ? "bg-primary-light" : "bg-gray-700"
                     )} />
                   ))}
                 </div>
               </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
