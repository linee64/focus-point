import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Send, User, Bot, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { analyzeVideo } from '../services/geminiService';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  type?: 'text' | 'summary';
}

export const AIChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addNote } = useStore();
  const { videoUrl, videoFile } = location.state || {};
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!videoUrl && !videoFile) {
      navigate('/review');
      return;
    }

    if (hasStarted.current) return;
    hasStarted.current = true;

    const startAnalysis = async () => {
      const initialMessages: Message[] = [
        {
          id: `msg-${Date.now()}-1`,
          role: 'bot',
          content: 'Привет! Я получил твое видео. Сейчас я его внимательно изучу и составлю подробный конспект. Это займет несколько секунд... ⏳'
        }
      ];
      setMessages(initialMessages);
      setIsTyping(true);

      try {
        const result = await analyzeVideo(videoUrl || videoFile, !!videoUrl);
        
        // Сохраняем конспект в хранилище
        const title = videoFile ? (videoFile as File).name : "Конспект видео";
        addNote({
          title: title,
          content: result,
          type: videoFile ? 'file' : 'video',
          sourceUrl: typeof videoUrl === 'string' ? videoUrl : undefined
        });

        // Эффект печатания для конспекта
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-2`,
            role: 'bot',
            content: result,
            type: 'summary'
          }
        ]);
        
        // Добавляем финальное сообщение
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `msg-${Date.now()}-3`,
              role: 'bot',
              content: 'Конспект готов и сохранен в твои заметки! Надеюсь, он поможет тебе в учебе. Если нужно что-то уточнить, я всегда здесь. 🎓'
            }
          ]);
        }, 500);

      } catch (error: any) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-err`,
            role: 'bot',
            content: error.message || 'Извини, произошла ошибка при анализе видео. Попробуй еще раз или проверь ссылку. 😕'
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    startAnalysis();
  }, [videoUrl, videoFile, navigate, addNote]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0F] text-white">
      {/* Header */}
      <header className="p-4 border-b border-white/5 flex items-center gap-4 bg-[#18181B]/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/review')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">ИИ-Тьютор</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Анализирует видео</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.role === 'bot' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {message.role === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`p-4 rounded-2xl ${
                  message.role === 'bot' 
                    ? 'bg-[#18181B] border border-white/5 text-gray-200' 
                    : 'bg-purple-600 text-white'
                } ${message.type === 'summary' ? 'w-full' : ''}`}>
                  {message.type === 'summary' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-purple-400 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Готовый конспект</span>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      <div className="flex justify-end pt-2">
                        <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Сгенерировано ИИ
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-[#18181B] border border-white/5 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-xs text-gray-400">ИИ изучает видео...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area (Disabled during analysis) */}
      <div className="p-4 bg-[#0B0B0F] border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Задай вопрос по конспекту..."
            disabled={isTyping}
            className="w-full bg-[#18181B] border border-white/10 rounded-xl py-4 px-4 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
          />
          <button 
            disabled={isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-lg text-white disabled:opacity-50 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
