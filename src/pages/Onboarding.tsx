import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronRight, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop",
    title: "Умное планирование",
    description: "ИИ составляет расписание за тебя, учитывая твои силы и время."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    title: "Никаких перегрузок",
    description: "Система следит за твоим состоянием и адаптирует нагрузку."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    title: "Достигай целей",
    description: "Готов начать свой путь к эффективной учебе?"
  }
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [view, setView] = useState<'carousel' | 'register' | 'login'>('carousel');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login specific states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginEmailValid, setIsLoginEmailValid] = useState(false);
  const [showLoginPasswordInput, setShowLoginPasswordInput] = useState(false);
  const [loginShakeButton, setLoginShakeButton] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const completeOnboarding = useStore((state) => state.completeOnboarding);

  useEffect(() => {
    // Only allow English letters, numbers, dots, underscores, hyphens before @
    // Only allow English letters, numbers, dots, hyphens after @
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsLoginEmailValid(emailRegex.test(loginEmail));
  }, [loginEmail]);

  useEffect(() => {
    // Must contain English letters AND numbers. Special chars optional. Min 6 chars.
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const validChars = /^[a-zA-Z0-9_{}()\[\]!@#$%^&*+=<>?|~`.-]+$/.test(password);
    
    const isValid = password.length >= 6 && hasLetters && hasNumbers && validChars;
    setIsPasswordValid(isValid);
    if (isValid) setShowPasswordError(false);
  }, [password]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
  };

  const handleCreateAccount = () => {
    if (isEmailValid && isPasswordValid) {
      completeOnboarding();
    } else {
      setShakeButton(true);
      if (!isPasswordValid) setShowPasswordError(true);
      setTimeout(() => setShakeButton(false), 500);
    }
  };

  const handleLogin = () => {
    // Fake login validation
    if (loginPassword.length >= 6) {
        completeOnboarding();
    } else {
        setLoginShakeButton(true);
        setLoginError(true);
        setTimeout(() => setLoginShakeButton(false), 500);
    }
  };

  const renderCarousel = () => (
    <div className="flex-1 relative overflow-hidden flex flex-col h-full">
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex flex-col cursor-grab active:cursor-grabbing"
          >
            {/* Image Container */}
            <div className="h-[60%] w-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Text Container */}
            <div className="flex-1 px-8 pt-8 flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-8 pb-12">
        {currentSlide === slides.length - 1 ? (
          <div className="space-y-3">
            <button 
              onClick={() => setView('register')}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Регистрация
            </button>
            <button 
              onClick={() => setView('login')}
              className="w-full bg-surface border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Войти
            </button>

            <div className="relative flex items-center gap-4 py-1">
                <div className="flex-1 h-[1px] bg-white/10"></div>
                <span className="text-gray-500 text-sm">или</span>
                <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            <button 
                className="w-full bg-white text-gray-700 font-semibold py-4 rounded-xl transition-colors hover:bg-gray-100 flex items-center justify-center gap-3"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                Войти через Google
            </button>
          </div>
        ) : (
          <button 
            onClick={handleNext}
            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-lg"
          >
            Далее <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img 
          src="https://i.pinimg.com/736x/0f/df/48/0fdf484ccf80ea3301e22e815866f44b.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <button 
        onClick={() => {
            if (showPasswordInput) setShowPasswordInput(false);
            else setView('carousel');
        }}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">
              Добро пожаловать
            </h2>
            <p className="text-gray-300 text-lg">
              Начни свой путь вместе с SleamAI
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 relative">
              <label className="text-sm text-gray-400 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors pr-12"
                />
                <AnimatePresence>
                  {isEmailValid && (
                    <motion.div
                      key="email-valid"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-5 -translate-y-1/2 text-green-500"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!showPasswordInput && (
                <div className="space-y-4">
                     <div className="text-sm text-gray-400 leading-relaxed text-center">
                        Нажимая «Продолжить», вы соглашаетесь с нашей{' '}
                        <a href="#" className="text-primary hover:underline">Политикой конфиденциальности</a>
                        {' '}и{' '}
                        <a href="#" className="text-primary hover:underline">Условиями использования</a>
                    </div>
                    <button
                        onClick={() => isEmailValid && setShowPasswordInput(true)}
                        disabled={!isEmailValid}
                        className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg"
                    >
                        Продолжить
                    </button>
                </div>
            )}

            <AnimatePresence>
              {showPasswordInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Пароль</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Минимум 6 символов..."
                        className={`w-full bg-surface/50 backdrop-blur-sm border rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors pr-20 ${
                          showPasswordError ? 'border-red-500' : 'border-white/10 focus:border-primary'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                         <button
                           onClick={() => setShowPassword(!showPassword)}
                           className="text-gray-400 hover:text-white transition-colors"
                         >
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                        <AnimatePresence>
                          {isPasswordValid && (
                            <motion.div
                              key="pass-valid"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="text-green-500"
                            >
                              <Check size={20} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <p className={`text-xs ml-1 transition-colors ${showPasswordError ? 'text-red-500' : 'text-gray-400'}`}>
                      Латинские буквы и цифры обязательно. Спецсимволы опционально.
                    </p>
                  </div>

                  <motion.button
                    onClick={handleCreateAccount}
                    animate={shakeButton ? { x: [-20, 20, -20, 20, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg"
                  >
                    Создать аккаунт
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex-1 flex flex-col p-8 pt-12 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <img 
          src="https://i.pinimg.com/736x/0f/df/48/0fdf484ccf80ea3301e22e815866f44b.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <button 
        onClick={() => setView('carousel')}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">
              С возвращением!
            </h2>
            <p className="text-gray-300 text-lg">
              Войдите, чтобы продолжить
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 relative">
              <label className="text-sm text-gray-400 ml-1">Email</label>
              <div className="relative">
                 <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-surface/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <AnimatePresence>
                  {isLoginEmailValid && (
                    <motion.div
                      key="login-email-valid"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-5 -translate-y-1/2 text-green-500"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!showLoginPasswordInput && (
                <button
                    onClick={() => isLoginEmailValid && setShowLoginPasswordInput(true)}
                    disabled={!isLoginEmailValid}
                    className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg"
                >
                    Далее
                </button>
            )}

            <AnimatePresence>
                {showLoginPasswordInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        className="space-y-6 overflow-hidden"
                    >
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400 ml-1">Пароль</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => {
                                  setLoginPassword(e.target.value);
                                  setLoginError(false);
                              }}
                              placeholder="Введите пароль"
                              className={`w-full bg-surface/50 backdrop-blur-sm border rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none transition-colors pr-12 ${
                                loginError ? 'border-red-500' : 'border-white/10 focus:border-primary'
                              }`}
                            />
                            <button
                               onClick={() => setShowPassword(!showPassword)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                             >
                               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                             </button>
                          </div>
                          {loginError && (
                              <p className="text-xs text-red-500 ml-1">
                                  Неверный пароль
                              </p>
                          )}
                        </div>

                        <motion.button
                          onClick={handleLogin}
                          animate={loginShakeButton ? { x: [-20, 20, -20, 20, -10, 10, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all text-lg mt-4"
                        >
                          Войти
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {view === 'carousel' && renderCarousel()}
      {view === 'register' && renderRegister()}
      {view === 'login' && renderLogin()}
    </div>
  );
};
