import { Bell, BookOpen, Clock, CheckCircle2, MapPin, Play, ChevronRight, Smile, Meh, Frown, Sparkles, Target, Plus } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <header className="flex justify-between items-center pt-2 px-1">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#8B5CF6]">SleamAI</h1>
            <p className="text-xs text-gray-400">Воскресенье, 28 Декабря</p>
          </div>
        </div>
        <button className="p-2 rounded-full bg-[#18181B] hover:bg-[#27272A] transition-colors border border-white/5 relative">
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
            <span className="text-xl font-bold text-white">6</span>
          </div>
          
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Часов</span>
            <span className="text-xl font-bold text-white">4.5</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-1">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Готово</span>
            <span className="text-xl font-bold text-white">2/5</span>
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
          <span className="text-xs text-gray-500">6 уроков</span>
        </div>

        <div className="space-y-2">
          {/* Completed Lesson 1 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-green-500 rounded-r-full"></div>
            <div className="flex justify-between items-center pl-3">
              <div>
                <h3 className="font-bold text-gray-500 line-through decoration-gray-600">Математика</h3>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span>08:30 - 09:15</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>204</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Completed Lesson 2 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-green-500 rounded-r-full"></div>
            <div className="flex justify-between items-center pl-3">
              <div>
                <h3 className="font-bold text-gray-500 line-through decoration-gray-600">Русский язык</h3>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span>09:20 - 10:05</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>301</span>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Current Lesson */}
          <div className="bg-[#212129] p-4 rounded-2xl border border-purple-500 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
            <div className="flex justify-between items-center pl-3">
              <div>
                <h3 className="font-bold text-white text-lg">Физика</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>10:20 - 11:05</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>105</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                Сейчас
              </span>
            </div>
          </div>

          {/* Upcoming Lesson 1 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/20 rounded-r-full"></div>
            <div className="flex justify-between items-center pl-3">
              <div>
                <h3 className="font-bold text-white">История</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>11:15 - 12:00</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>302</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Lesson 2 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/20 rounded-r-full"></div>
            <div className="flex justify-between items-center pl-3">
              <div>
                <h3 className="font-bold text-white">Английский</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>12:10 - 12:55</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>205</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Lesson 3 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-white/20 rounded-r-full"></div>
            <div className="flex justify-between items-center pl-3">
              <div>
                <h3 className="font-bold text-white">Литература</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>13:05 - 13:50</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>301</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/20">
              <Plus className="w-3.5 h-3.5" />
              Добавить
            </button>
            <span className="text-xs text-gray-500">3 задач</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Deadline 1 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm">Сочинение по литературе</h3>
                <p className="text-xs text-gray-500 mt-0.5">Литература</p>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span>2 дн.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[30%] rounded-full"></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">30%</span>
            </div>
          </div>

          {/* Deadline 2 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm">Проект по физике</h3>
                <p className="text-xs text-gray-500 mt-0.5">Физика</p>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span>8 дн.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">60%</span>
            </div>
          </div>

          {/* Deadline 3 */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm">Контрольная по математике</h3>
                <p className="text-xs text-gray-500 mt-0.5">Математика</p>
              </div>
              <div className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-400/10 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span>Завтра</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[80%] rounded-full"></div>
              </div>
              <span className="text-xs text-gray-500 font-medium">80%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Review / Repetition */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-5 h-5 rounded-full border border-purple-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
            </div>
            <h2 className="font-bold">Повторение</h2>
          </div>
          <span className="text-xs text-gray-500">~18 мин</span>
        </div>

        <div className="bg-[#121215] border border-purple-500/20 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-2xl font-bold text-white">2 темы</h3>
              <p className="text-xs text-gray-400 mt-1">для закрепления материала</p>
            </div>
            <button className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-purple-500/30">
              <Play className="w-4 h-4 fill-white" />
              Начать
            </button>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200">Интегралы</h4>
                  <p className="text-[10px] text-gray-500">Математика • 10 мин</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">1x</span>
                 <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200">Законы Ньютона</h4>
                  <p className="text-[10px] text-gray-500">Физика • 8 мин</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">2x</span>
                 <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Check-in */}
      <section className="bg-[#121215] border border-white/5 rounded-3xl p-5 space-y-4">
        <h3 className="text-center font-bold text-white">Как прошёл день?</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#18181B] border border-green-500/30 hover:bg-green-500/10 transition-colors group">
            <Smile className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-green-500">Легко</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#18181B] border border-blue-500/30 hover:bg-blue-500/10 transition-colors group">
            <Meh className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-blue-500">Нормально</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#18181B] border border-orange-500/30 hover:bg-orange-500/10 transition-colors group">
            <Frown className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-orange-500">Тяжело</span>
          </button>
        </div>

        <button className="w-full bg-[#2E2E36] text-gray-400 font-bold py-3.5 rounded-xl hover:bg-[#3E3E46] hover:text-white transition-colors">
          Отправить
        </button>
      </section>
    </div>
  );
};
