-- SQL Скрипт для настройки базы данных FocusPoint в Supabase

-- 1. Таблица профилей пользователей (синхронизация настроек и данных)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    settings JSONB DEFAULT '{
        "wakeUpTime": "07:00",
        "bedTime": "23:00",
        "breakfastTime": "07:30",
        "lunchTime": "13:00",
        "dinnerTime": "19:00",
        "schoolStart": "08:00",
        "schoolEnd": "14:00",
        "commuteTime": 30,
        "routineActivities": []
    }'::jsonb,
    tasks JSONB DEFAULT '[]'::jsonb,
    schedule JSONB DEFAULT '[]'::jsonb,
    notes JSONB DEFAULT '[]'::jsonb,
    ai_plans JSONB DEFAULT '{}'::jsonb,
    streak INTEGER DEFAULT 0,
    last_login_date TEXT,
    has_onboarded BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем Row Level Security (RLS) для таблицы profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут видеть только свой профиль
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Политика: пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Политика: пользователи могут вставлять только свой профиль
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Таблица отзывов (feedback)
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS для таблицы feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Политика: любой авторизованный пользователь может оставить отзыв
CREATE POLICY "Authenticated users can insert feedback" 
ON feedback FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Политика: пользователи могут видеть только свои отзывы (опционально, если нужно)
CREATE POLICY "Users can view own feedback" 
ON feedback FOR SELECT 
USING (auth.uid() = user_id);

-- Функция для автоматического создания профиля при регистрации (опционально, но рекомендуется)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id)
--   VALUES (new.id);
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
