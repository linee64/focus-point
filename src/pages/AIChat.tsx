import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Send, User, Bot, Loader2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { analyzeVideo, chatWithAI } from '../services/geminiService';
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
  const { videoUrl, videoFile, existingNote } = location.state || {};
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('ИИ печатает...');
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    // Если есть существующая заметка, загружаем её
    if (existingNote) {
      if (messages.length === 0) {
        setMessages([
          {
            id: `msg-${Date.now()}-1`,
            role: 'bot',
            content: `Загружен конспект: **${existingNote.title}**`
          },
          {
            id: `msg-${Date.now()}-2`,
            role: 'bot',
            content: existingNote.content,
            type: 'summary'
          }
        ]);
      }
      return;
    }

    // Если видео нет, просто приветствуем пользователя
    if (!videoUrl && !videoFile) {
      if (messages.length === 0) {
        setMessages([{
          id: `msg-${Date.now()}`,
          role: 'bot',
          content: 'Привет! Я твой личный помощник SleamAI. Ты можешь просто пообщаться со мной или скинуть ссылку на видео для создания конспекта. Чем могу помочь? 😊'
        }]);
      }
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
      setTypingStatus('Анализирую видео...');
      setIsTyping(true);

      try {
        const { summary, title } = await analyzeVideo(videoUrl || videoFile, !!videoUrl);
        
        setIsTyping(false);

        // Добавляем конспект
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-2`,
            role: 'bot',
            content: summary,
            type: 'summary'
          }
        ]);

        // Сохраняем конспект в хранилище
        addNote({
          title: title,
          content: summary,
          type: videoFile ? 'file' : 'video',
          sourceUrl: typeof videoUrl === 'string' ? videoUrl : undefined
        });
        
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
    // Авто-скролл только для новых коротких сообщений, но не для конспекта
    const lastMessage = messages[messages.length - 1];
    if (scrollRef.current && lastMessage && lastMessage.type !== 'summary') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatContent = (content: string) => {
    // Улучшенная обработка LaTeX для корректного отображения в ReactMarkdown
    // 1. Убеждаемся, что блочные формулы $$...$$ находятся на новых строках
    let formatted = content.replace(/\$\$(.*?)\$\$/gs, '\n$$\n$1\n$$\n');
    
    // 2. Обрабатываем инлайновые формулы $...$, убирая лишние пробелы по краям
    // Но добавляем пробелы СНАРУЖИ долларов, чтобы markdown не путал их с обычным текстом
    formatted = formatted.replace(/(?<!\$)\$([^\$\n]+)\$(?!\$)/g, (_, formula) => {
      return ` $${formula.trim()}$ `;
    });
    
    return formatted;
  };

  const MarkdownComponent = ({ content }: { content: string }) => (
    <div className="prose prose-invert prose-sm max-w-none leading-relaxed prose-p:my-2 prose-headings:mb-3 prose-headings:mt-6">
      <ReactMarkdown 
        remarkPlugins={[remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
        }}
      >
        {formatContent(content)}
      </ReactMarkdown>
    </div>
  );

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTypingStatus('ИИ думает...');
    setIsTyping(true);

    try {
      // Формируем историю для Gemini
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const aiResponse = await chatWithAI(userMessage.content, chatHistory);
      
      const botMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'bot',
        content: aiResponse,
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'bot',
        content: error.message || 'Произошла ошибка при получении ответа. 😕',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0B0F] text-white overflow-hidden">
      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate('/review')} 
          className="p-3 bg-[#18181B]/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-[#27272A] transition-all pointer-events-auto shadow-2xl group flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider pr-1">В меню</span>
        </button>
        
        <div className="p-3 bg-[#18181B]/80 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-auto shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block pr-2">
            <h1 className="text-xs font-bold">SleamAI</h1>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pt-24 space-y-6 scrollbar-hide"
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
                      <MarkdownComponent content={message.content} />
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        <div className="flex-1" />
                        <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Сгенерировано ИИ
                        </div>
                      </div>
                    </div>
                  ) : (
                    <MarkdownComponent content={message.content} />
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
                <span className="text-xs text-gray-400">{typingStatus}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0B0B0F] border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Задай вопрос ИИ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
            className="w-full bg-[#18181B] border border-white/10 rounded-xl py-4 px-4 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isTyping || !inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-lg text-white disabled:opacity-50 transition-all active:scale-95 hover:bg-purple-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
