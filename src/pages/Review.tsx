import { useState, useRef } from 'react';
import { Bell, Sparkles, Upload, Link as LinkIcon, FileText, Send, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const Review = () => {
  const { setNotificationsOpen, notes, removeNote } = useStore();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      navigate('/ai-chat', { state: { videoFile: file } });
    }
  };

  const handleUrlSubmit = async () => {
    if (!videoUrl) return;
    navigate('/ai-chat', { state: { videoUrl } });
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(videoUrl);

  return (
    <div className="space-y-6 pb-20 relative">
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

      {/* Main Content */}
      <div className="space-y-6 px-1">
        
        {/* AI Notes Card */}
        <div className="bg-[#1e1b2e] p-5 rounded-2xl border border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.25)] relative overflow-hidden">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Конспект из видео</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Загрузи видеоурок или вставь ссылку — ИИ создаст структурированный конспект
                </p>
              </div>
              <button 
                onClick={() => navigate('/ai-chat')}
                className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Перейти к ИИ-чату
              </button>
            </div>
          </div>
        </div>

        {/* Upload Video Card */}
        <button 
          onClick={handleUploadClick}
          className="w-full bg-[#18181B]/60 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:bg-[#27272A]/80 transition-all text-left flex items-center gap-4 group"
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <Upload className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white mb-0.5">Загрузить видео</h3>
            <p className="text-xs text-gray-500">MP4, MOV, AVI до 500MB</p>
          </div>
        </button>

        {/* Paste Link Card */}
        <div className="bg-[#18181B]/60 backdrop-blur-sm p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-0.5">Вставить ссылку</h3>
              <div className="relative mt-2">
                <input 
                  type="text" 
                  placeholder="https://youtube.com/watch?v=..." 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-[#0B0B0F]/80 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {videoId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-4 pt-2"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Video preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={handleUrlSubmit}
                  className="w-full bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Создать конспект
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Notes Section */}
        {notes.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Твои конспекты
              </h3>
              <span className="text-xs text-purple-400 font-medium">{notes.length}</span>
            </div>
            
            <div className="grid gap-4 px-1">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#18181B]/60 backdrop-blur-sm p-5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:bg-[#27272A]/80 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 text-purple-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm break-words leading-tight" title={note.title}>
                      {note.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(note.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/ai-chat', { state: { existingNote: note } })}
                      className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/20 hover:text-purple-400"
                    >
                      <Send className="w-4 h-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNote(note.id);
                      }}
                      className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
