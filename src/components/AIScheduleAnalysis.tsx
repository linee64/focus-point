import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, RefreshCw, Coffee, Zap, Moon, Pencil, Trash2, Check, X, BookOpen, Utensils, Bed } from 'lucide-react';
import { useStore } from '../store/useStore';
import { analyzeSchedule } from '../services/geminiService';
import { PlanItem } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { clsx } from 'clsx';

interface AIScheduleAnalysisProps {
  selectedDate: Date;
}

export const AIScheduleAnalysis: React.FC<AIScheduleAnalysisProps> = ({ selectedDate }) => {
  const { 
    schedule, 
    settings, 
    aiPlans, 
    setAIPlan, 
    updateAIPlanItem, 
    removeAIPlanItem, 
    toggleAIPlanItem 
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentPlan = aiPlans[dateKey];

  const daySchedule = schedule.filter(event => 
    event.date === dateKey
  );

  const generateFingerprint = () => {
    return JSON.stringify({
      schedule: (daySchedule || []).map(e => ({ t: e.title, s: e.startTime, e: e.endTime })),
      settings: {
        w: settings?.wakeUpTime,
        b: settings?.bedTime,
        c: settings?.commuteTime,
        r: (settings?.routineActivities || []).map(a => ({ t: a.title, s: a.startTime, e: a.endTime }))
      }
    });
  };

  const performAnalysis = async (force = false) => {
    const fingerprint = generateFingerprint();
    
    // Если план уже есть и данные не изменились, и это не принудительное обновление
    if (!force && currentPlan && currentPlan.fingerprint === fingerprint) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSchedule(
        format(selectedDate, 'd MMMM', { locale: ru }),
        daySchedule,
        settings
      );
      
      if (!result || !result.plan) {
        throw new Error("ИИ вернул пустой план");
      }
      
      const itemsWithId = result.plan.map((item: any, index: number) => ({
        ...item,
        id: `ai-item-${Date.now()}-${index}`,
        isCompleted: false
      }));
      
      setAIPlan(dateKey, {
        items: itemsWithId,
        analysis: result.analysis,
        lastGenerated: new Date().toISOString(),
        fingerprint
      });
    } catch (err: any) {
      let friendlyMessage = err.message || 'Не удалось проанализировать график';
      
      if (friendlyMessage.includes('429') || friendlyMessage.includes('quota')) {
        friendlyMessage = 'Превышен лимит запросов к ИИ (20 в день). Пожалуйста, подождите немного или попробуйте завтра.';
      }
      
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Автоматически генерируем план ТОЛЬКО если его вообще нет для этой даты
    if (selectedDate >= today) {
      if (!currentPlan) {
        performAnalysis();
      }
    }
  }, [selectedDate]); // Убираем schedule и settings из зависимостей, чтобы не регенерировать при изменениях

  const toggleComplete = (id: string) => {
    toggleAIPlanItem(dateKey, id);
  };

  const removeItem = (id: string) => {
    removeAIPlanItem(dateKey, id);
  };

  const startEditing = (item: PlanItem) => {
    setEditingId(item.id);
    setEditValue(item.title);
  };

  const saveEdit = (id: string) => {
    updateAIPlanItem(dateKey, id, { title: editValue });
    setEditingId(null);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'rest': return <Coffee size={14} />;
      case 'productivity': return <Zap size={14} />;
      case 'activity': return <Zap size={14} />;
      case 'school': return <BookOpen size={14} />;
      case 'meal': return <Utensils size={14} />;
      case 'sleep': return <Bed size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (selectedDate < new Date(new Date().setHours(0,0,0,0))) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <Sparkles size={18} />
          </div>
          <h3 className="font-bold text-white text-lg">План дня</h3>
        </div>
        <button 
          onClick={() => performAnalysis(true)}
          disabled={isLoading}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={clsx(isLoading && "animate-spin")} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-3"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <Sparkles className="absolute inset-0 m-auto text-purple-400 w-5 h-5 animate-pulse" />
            </div>
            <p className="text-gray-400 text-sm animate-pulse">Sleam планирует ваш день...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center"
          >
            <p className="text-red-400 text-sm">{error}</p>
            <button 
              onClick={() => performAnalysis(true)}
              className="mt-2 text-xs font-bold text-red-400 underline"
            >
              Попробовать снова
            </button>
          </motion.div>
        ) : currentPlan ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* AI To-Do List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <Clock size={14} />
                  Распорядок дня
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => performAnalysis(true)}
                    disabled={isLoading}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                    title="Обновить план"
                  >
                    <RefreshCw size={14} className={clsx(isLoading && "animate-spin")} />
                  </button>
                  <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">
                    {(currentPlan.items || []).filter(s => s.isCompleted).length}/{(currentPlan.items || []).length}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-3">
                {(currentPlan.items || []).length > 0 ? (
                  (currentPlan.items || []).map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={clsx(
                        "bg-[#18181B] border rounded-2xl p-4 flex items-start gap-4 transition-all group relative",
                        item.isCompleted ? "border-green-500/20 opacity-60" : "border-white/5 hover:border-purple-500/30"
                      )}
                    >
                      {/* Checkbox */}
                      <button 
                        onClick={() => toggleComplete(item.id)}
                        className={clsx(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5",
                          item.isCompleted 
                            ? "bg-green-500 border-green-500 text-white" 
                            : "border-gray-700 hover:border-purple-500"
                        )}
                      >
                        {item.isCompleted && <Check size={14} strokeWidth={3} />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-sm font-mono text-gray-500 bg-white/5 px-2 py-0.75 rounded">
                            {item.start} - {item.end}
                          </span>
                          <div className={clsx(
                            "flex items-center gap-1 text-xs font-bold uppercase px-1.5 py-0.5 rounded",
                            item.type === 'rest' ? "bg-green-500/10 text-green-500" :
                            item.type === 'productivity' ? "bg-blue-500/10 text-blue-500" :
                            item.type === 'activity' ? "bg-blue-500/10 text-blue-500" :
                            item.type === 'school' ? "bg-purple-500/10 text-purple-400" :
                            item.type === 'meal' ? "bg-orange-500/10 text-orange-400" :
                            item.type === 'sleep' ? "bg-indigo-500/10 text-indigo-400" :
                            "bg-gray-500/10 text-gray-400"
                          )}>
                            {getItemIcon(item.type)}
                            {item.type === 'rest' ? 'Отдых' :
                             item.type === 'productivity' ? 'Учеба' :
                             item.type === 'activity' ? 'Активность' :
                             item.type === 'school' ? 'Школа' :
                             item.type === 'meal' ? 'Прием пищи' :
                             item.type === 'sleep' ? 'Сон' :
                             'Занятие'}
                          </div>
                          {item.isRecommendation && (
                            <span className="text-xs bg-purple-500/20 text-purple-400 p-1 rounded flex items-center justify-center">
                              <Sparkles size={12} />
                            </span>
                          )}
                        </div>

                        {editingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                              className="flex-1 bg-white/5 border border-purple-500/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                            />
                            <button onClick={() => saveEdit(item.id)} className="p-1 text-green-400 hover:bg-green-400/10 rounded">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <p className={clsx(
                            "text-gray-300 text-sm font-medium leading-relaxed break-words whitespace-normal",
                            item.isCompleted && "line-through text-gray-600"
                          )}>
                            {item.title}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      {!item.isCompleted && editingId !== item.id && (
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                          <button 
                            onClick={() => startEditing(item)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center">
                    <Moon className="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
                    <p className="text-gray-500 text-sm italic">План на день пуст. Попробуйте обновить!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center">
             <button 
              onClick={() => performAnalysis(true)}
              className="flex flex-col items-center gap-2 mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Sparkles size={24} />
              </div>
              <span className="text-gray-400 text-sm font-medium">Создать план дня</span>
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
