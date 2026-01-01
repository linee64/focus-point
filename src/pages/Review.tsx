import { Bell, Sparkles, Upload, Link as LinkIcon, FileText } from 'lucide-react';

export const Review = () => {
  return (
    <div className="space-y-6 pb-20 relative">
      {/* Header */}
      <header className="flex justify-between items-center pt-2 px-1">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#8B5CF6]">SleamAI</h1>
            <p className="text-xs text-gray-400">Четверг, 1 Января</p>
          </div>
        </div>
        <button className="p-2 rounded-full bg-[#18181B] hover:bg-[#27272A] transition-colors border border-white/5 relative">
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
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Конспект из видео</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Загрузи видеоурок или вставь ссылку — ИИ создаст структурированный конспект
              </p>
            </div>
          </div>
        </div>

        {/* Upload Video Card */}
        <button className="w-full bg-[#18181B]/60 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:bg-[#27272A]/80 transition-all text-left flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <Upload className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white mb-0.5">Загрузить видео</h3>
            <p className="text-xs text-gray-500">MP4, MOV, AVI до 500MB</p>
          </div>
        </button>

        {/* Separator */}
        <div className="flex items-center gap-4 px-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <span className="text-xs text-gray-500 font-medium">или</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Paste Link Card */}
        <div className="bg-[#18181B]/60 backdrop-blur-sm p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-0.5">Вставить ссылку</h3>
              <p className="text-xs text-gray-500">YouTube, Rutube, VK Video</p>
            </div>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="https://youtube.com/watch?v=..." 
              className="w-full bg-[#0B0B0F]/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
