import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Loader2, FileText, CheckCheck, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

const MOCK_SUMMARY = `
## Конспект: Введение в квантовую физику
Это видео объясняет основные принципы квантовой механики, фокусируясь на корпускулярно-волновом дуализме.

### Ключевые концепции:
- **Корпускулярно-волновой дуализм**: Свет ведет себя и как частица, и как волна.
- **Кот Шрёдингера**: Мысленный эксперимент, иллюстрирующий суперпозицию.
- **Эффект наблюдателя**: Измерение квантовой системы меняет ее состояние.

### Примеры:
> "Представьте вращающуюся монету. Пока вы ее не поймаете, это орел И решка одновременно."

### Рефлексия:
Как это меняет ваше представление о реальности?
`;

export const AITutor = () => {
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'examples' | 'tasks'>('summary');

  const handleGenerate = () => {
    if (!url) return;
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setResult(MOCK_SUMMARY);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          ИИ Тьютор <Sparkles className="text-yellow-400 w-5 h-5" />
        </h1>
        <p className="text-gray-400 text-sm">Превращай видео в учебные материалы.</p>
      </header>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="input"
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Вставь ссылку на видео</h3>
              <p className="text-xs text-gray-400 mt-1">YouTube или прямая ссылка</p>
            </div>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/..." 
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !url}
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : 'Создать конспект'}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Tabs */}
            <div className="flex p-1 bg-white/5 rounded-lg">
               {[
                 { id: 'summary', icon: FileText, label: 'Конспект' },
                 { id: 'examples', icon: Lightbulb, label: 'Примеры' },
                 { id: 'tasks', icon: CheckCheck, label: 'Тест' }
               ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={clsx(
                     "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all",
                     activeTab === tab.id ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                   )}
                 >
                   <tab.icon size={14} />
                   {tab.label}
                 </button>
               ))}
            </div>

            <div className="p-4 rounded-xl bg-surface border border-white/10 min-h-[300px] prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full text-sm text-gray-500 hover:text-white transition-colors"
            >
              Разобрать другое видео
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
