# Cursor Logs

## 2025-12-25
- Initialized project structure (Manual setup due to environment constraints).
- Installed dependencies: React, TypeScript, Vite, Tailwind CSS, Zustand, Date-fns, Lucide-react.
- Setup basic file structure.
- Implemented Layout with Bottom Navigation.
- Created Pages: Dashboard, Tasks, AI Tutor, Settings.
- Implemented Store with mock data and Types.
- Implemented "AI Tutor" UI with mock generation logic.
- Configured Tailwind CSS with custom colors (Black, Purple, Blue).
- Verified build and started development server.
- **Added Onboarding Flow**: Created a carousel with 3 slides and "Login/Register" buttons on the final slide. Integrated with Zustand store (`hasOnboarded`).
- **Localized Application**: Translated Dashboard, Tasks, AI Tutor, Settings, and BottomNav to Russian.
- **UI Improvements**: Added "FocusPoint" header to the Dashboard.
- **Dashboard Header Redesign**:
    - Removed old text elements (Time, "Plan for today").
    - Implemented a scrollable horizontal date strip (7 days).
    - Added a calendar button that opens a custom styled calendar modal for date selection.
- **UI Tweaks**:
    - Reduced scale of date strip cards.
    - Added "Edit" (pencil) and "Complete" (check) mini-buttons to each schedule item on the Dashboard.
    - Changed date strip to show current week (Mon-Sun).
    - Added "Add Schedule Item" button.
- **Dashboard Refinements**:
    - Fixed BottomNav z-index.
    - Updated date format to short day names (ПН, ВТ...).
    - Added logo placeholder (gradient circle) next to title.
    - Moved Calendar button to the actions bar below the date strip.

## 2026-01-01
- **Dashboard Overhaul**:
    - Rewrote `Dashboard.tsx` to match new design mockups.
    - Updated `BottomNav.tsx` with new icons and labels (Home, Schedule, Deadlines, Review, Profile).
    - Applied diagonal gradient background (purple -> black -> blue) to the Dashboard layout.
    - Darkened card backgrounds and added specific styling for "Current" vs "Past/Future" lessons.
    - Removed the "Review / Repetition" section from Dashboard.
- **Review / AI Tutor Page Implementation**:
    - Created `src/pages/Review.tsx` corresponding to the "ИИ Тьютор" tab.
    - Implemented UI matching the user's design:
        - Header with "SleamAI", date, and notification bell (consistent with Dashboard).
        - Dark gradient background (purple/black/blue).
        - "Notes from video" card with purple accent and glow.
        - "Upload video" card.
        - "Paste link" card with input field.
    - Registered `/review` route in `App.tsx`.
    - Verified app startup (dependencies installed, server running on port 5174).
    - **Background Fix**: Moved background logic from `Review.tsx` to `Layout.tsx`.
    - **Refined Background**:
        - Replaced diagonal gradient with two distinct rounded blurred blobs (Purple top-left, Blue bottom-right).
    - **UI Polish**:
        - Removed the top border gradient line from the "AI Notes" card.
        - Enhanced the purple glow/shadow around the "AI Notes" card.
        - Cleaned up header (removed accidental dash text).
        - Added `backdrop-blur-sm` and adjusted opacity for "Upload Video" and "Paste Link" cards to make them slightly darker and blurred.
        - **Background Update**: Reduced size of background blobs from 300px to 200px and adjusted positioning slightly to keep them visible but unobtrusive.
        - **Global Background Update**: Applied the dark background with purple/blue blobs to **all tabs except the main Dashboard** (Schedule, Deadlines, Review, Settings, Profile).

## 2026-01-03
- **Profile Page Implementation**:
    - Created `src/pages/Profile.tsx` matching the user's design screenshot.
    - Implemented UI components:
        - Custom Header (SleamAI logo, date, bell).
        - User Info Card with avatar, name, subtitle, and stats (Streak, Tasks, Notes).
        - AI Analysis Card with motivational text and sparkles icon.
        - Settings Section with toggle switches for "Notifications" and "Sleep Mode", and a link to full "Settings".
        - Achievements Section with progress counter (2/3) and list of achievements (unlocked/locked states).
        - Logout Button.
    - Added `/profile` route to `App.tsx`.
- **Button Functionality Implementation**:
    - Created `src/components/Notifications.tsx`:
        - A popover/modal for notifications with glassmorphism design.
        - Shows a list of mock notifications (Deadlines, Grades, Schedule changes).
        - Integrated into `Dashboard.tsx`, `Profile.tsx`, and `Review.tsx`.
    - Created `src/components/AddTaskModal.tsx`:
        - A modal form to add new Tasks/Deadlines.
        - Fields: Subject, Title, Date, Type (Homework, Project, Exam).
        - Integrated into the "Add" button in `Dashboard.tsx`.

## 2026-01-24
- **Supabase Integration**:
    - Installed `@supabase/supabase-js`.
    - Created `src/services/supabase.ts` for Supabase client initialization.
    - Added `.env.example` with required Supabase credentials.
    - Updated `Onboarding.tsx`:
        - Replaced mock registration with `supabase.auth.signUp`.
        - Replaced mock login with `supabase.auth.signInWithPassword`.
        - Implemented Google OAuth login via `supabase.auth.signInWithOAuth`.
        - Added loading states (`isLoading`) and error handling (`authError`, `loginError`) for auth forms.
    - Updated `useStore.ts`:
        - Updated `logout` to perform `supabase.auth.signOut()` and clear local store.
    - Updated `App.tsx`:
        - Added session listener to automatically log in users with an active Supabase session.
- **Feedback Integration**:
    - Connected the feedback form in `Profile.tsx` to Supabase.
    - Created `handleSendFeedback` to insert feedback data into a Supabase `feedback` table.
    - Added loading and success states for the feedback submission button.
- **Verification & Identity**:
    - Added mandatory **Email Verification** screen after registration in `Onboarding.tsx`.
    - Integrated name/surname collection *during* the registration process.
    - User metadata (`first_name`, `last_name`) is now saved to Supabase during `signUp`.
    - Fixed the "Guest" bug by synchronizing Supabase `user_metadata` with the Zustand store in `App.tsx` and `Onboarding.tsx`.
    - Improved `logout` reliability by adding `try...catch` and pre-checking session to avoid `net::ERR_ABORTED` console errors.
- **Google Authentication**:
    - Added "Login/Register with Google" buttons to all authentication screens (`Login`, `Register`, `Carousel`).
    - Implemented logic to extract `first_name` and `last_name` from Google's `full_name` metadata in `App.tsx`.
- **Streak System**:
    - Added `streak` and `lastLoginDate` to the global state.
    - Implemented logic in `useStore` to update the streak automatically on app load.
    - If a user skips a day, the streak resets to 1. If they log in consecutively, it increments.
    - Updated `Profile.tsx` to display the real streak value with proper Russian pluralization.
    - Added `commuteTime` field to `UserSettings` and Onboarding.
    - Modified the Gemini prompt to automatically include commute time (e.g., "Дорога в школу") before and after school sessions.
- **Recurring Routine Templates**:
    - Added `routineActivities` to `UserSettings` to store permanent activities (Sleep, Breakfast, etc.).
    - Updated Onboarding to save initial activities as routine templates.
    - AI now prioritizes these templates when generating daily plans.
- **Bug Fixes**:
    - Resolved JSON parsing errors from Gemini by adding response cleaning and trailing comma removal.
    - Unified backend communication to port 8001.
    - Fixed Gemini quota (429) issues by adding fallback model logic and user-friendly error messages.
    - Removed initial "0" from numeric input fields in Onboarding and DailyRoutineModal for better UX.
    - Removed duplicate activity lists from the Schedule page; now everything is unified in the AI plan.

## 2026-01-09
- **UI Adjustments**:
    - Changed School icon color to gray in `Profile.tsx`.
    - Added hidden file input to `Review.tsx`'s "Загрузить видео" button for device file selection.
- **Gemini Integration**:
    - Installed `@google/generative-ai` SDK.
    - Created `geminiService.ts` for AI video analysis.
    - Updated model to `gemini-1.5-flash` for better performance and availability.
    - Improved error handling with regional and API key diagnostic messages.
- **AI Chat Experience**:
    - Created `AIChat.tsx` for an interactive video summarization experience.
    - Added `/ai-chat` route to `App.tsx`.
    - Implemented state transfer from `Review.tsx` to `AIChat.tsx` using `react-router-dom`.
    - Added typing indicators and structured markdown summary rendering in the chat.
- **Gemini Troubleshooting**:
    - Updated model name to `gemini-1.5-flash-latest` for improved API compatibility.
    - Implemented `console.dir(error)` and detailed logging in `geminiService.ts` to debug 404/403 errors.
- **Gemini Model Stability & Fallback**:
    - Switched to standard `gemini-1.5-flash` model name.
    - Added automatic fallback to `gemini-pro` if `gemini-1.5-flash` is not available (404 error).
    - Refactored `analyzeVideo` to use a retryable `tryModel` pattern.
- **AIChat UI Fixes**:
    - Fixed "Duplicate key" error in React by using `Date.now()` for message IDs.
    - Prevented double analysis in development mode using `useRef` guard.
- **Gemini Model Redundancy**:
    - Implemented iterative model fallback: `gemini-1.5-flash` -> `gemini-1.5-pro` -> `gemini-1.0-pro`.
    - Improved error messaging for API key and regional restrictions.
    - Added console warnings for failed model attempts to aid debugging.
- **Gemini Error Visibility**:
    - Refactored `analyzeVideo` to bubble up the exact last error message to the user.
    - Added explicit model prefixing (`models/`) to fallback list.
    - Improved UX for regional and API key error scenarios.
- **Gemini Service Reset**:
    - Simplified `geminiService.ts` to use only `gemini-1.5-flash`.
    - Replaced the hardcoded/leaked API key with a placeholder and instructions.
    - Added clear diagnostic messages for 404/403 errors to guide the user to Google AI Studio.
- **Smart Filtering**: Implemented strict date filtering in `Schedule.tsx` to prevent events from appearing on every day.
- **Intelligent Auto-fill**:
    - **Date**: Now automatically uses the selected date from the calendar when creating new events.
    - **Time**: Implemented logic to auto-suggest the next available time slot based on existing events (45-min duration by default).
    - **Content**: Created a `subjectsMap` with quick-selection buttons for common school subjects (Math, Physics, etc.). Selecting a subject automatically populates relevant subtasks.
- **UI Cleanup**: Removed redundant icons (MapPin, category tags) from the schedule list for a cleaner, more focused look.
- **Editing**: Fully implemented schedule event editing via the `AddScheduleModal`.
- **UI Polish (Onboarding)**:
    - Replaced all gradient titles in `Onboarding.tsx` with solid purple (`#8B5CF6`) for better readability.
    - Updated all input fields and selection buttons to use a blurred glassmorphism effect (`bg-white/5 backdrop-blur-md`).
    - Standardized the visual style across all onboarding steps (Register, Login, Name Input, Activity Input, etc.).
    - Verified that other pages (Dashboard, Schedule) follow the same design language without problematic gradients.
- **Navigation & Interactivity**:
    - Ensured automatic redirect to "Dashboard" after successful registration/login in `Onboarding.tsx`.
    - Implemented functional "Daily Check-in" section on `Dashboard.tsx` with mood selection, loading states, and submission feedback.
    - Enhanced `Dashboard.tsx` UI with glassmorphism for the check-in section.
- **Task & Deadline Management**:
    - **Data Model Update**: Added `subject` field to `Task` interface in `src/types/index.ts`.
    - **Store Improvements**:
        - Added `removeTask` action to `useStore`.
        - Updated `addTask` to store `subject` and `title` separately.
        - Refreshed `mockTasks` with the new structure.
    - **Dynamic Data Integration**:
        - Replaced hardcoded task lists in `Tasks.tsx` and `Dashboard.tsx` with live data from the Zustand store.
        - Tasks added via `AddTaskModal` now correctly appear in both the "Deadlines" tab and the "Dashboard" section.
    - **Task Deletion**:
        - Implemented a delete button (Trash icon) for each task in `Tasks.tsx` and `Dashboard.tsx`.
        - Styled the delete button to be subtle yet accessible, with hover/active states.
- **UI Polish**:
        - Added colorful borders and shadows to task items based on their type (Exam, Project, Homework).
        - Improved task completion toggling logic.
        - Standardized deadline date formatting using `date-fns`.
- **Task Border Color Logic**:
    - Implemented dynamic border colors based on remaining days in `Tasks.tsx` and `Dashboard.tsx`:
        - **0-3 days**: Purple border and shadow (`#8B5CF6`).
        - **4 days**: Yellow border and shadow.
        - **5-9 days**: Green border and shadow.
        - **10+ days**: Default subtle border.
    - Integrated `differenceInDays` and `startOfDay` from `date-fns` for accurate calculations.
    - Updated UI components to reflect these changes with smooth transitions and glassmorphism styling.
- **Overdue Task Highlighting & Deadline Display**:
    - Implemented red border and shadow for overdue tasks (days < 0).
    - Replaced absolute date display (e.g., "27 Dec") with relative time (e.g., "3 дн.", "Сегодня", "Просрочено").
    - Updated `Tasks.tsx` and `Dashboard.tsx` with consistent overdue styling.
    - Adjusted text labels for better clarity (e.g., "Дедлайн" as a secondary label on Dashboard).
- **Task UI Hierarchy Update**:
    - Made `subject` the primary heading with larger, bolder font (`text-lg` in Tasks, `text-base` in Dashboard).
    - Made `title` a sub-task with smaller font (`text-sm` / `text-xs`) and added a visual "sub-task" indicator (L-shaped arrow).
    - Swapped positions of `subject` and `title` in the UI to prioritize the subject name.
- **Fixed Add Task Functionality**:
    - Added form validation to `AddTaskModal.tsx`: the submit button is now disabled until all fields (subject, title, date) are filled.
    - Updated button styling to provide visual feedback for its disabled/enabled state.
    - Changed date storage format to ISO string for better precision and compatibility with `parseISO`.

## 2026-01-10
- **Backend Implementation (Video Summarizer)**:
    - Created `backend` directory with FastAPI application.
    - Integrated `yt-dlp` for audio extraction and `youtube-transcript-api` for subtitle retrieval.
    - Implemented local transcription using `faster-whisper` (small model) as a fallback for videos without subtitles.
    - Integrated Google Gemini 2.0 (Gemini-2.0-flash-exp) for AI-powered video summarization.
    - Added text processing utilities for cleaning and formatting transcripts.
    - Implemented `POST /summarize` endpoint.
    - Provided `.env.example` and `requirements.txt` for local setup.

### Ошибки и их решения
- **Проблема**: `ffmpeg/ffprobe not found` при работе `yt-dlp`.
- **Решение**: Использована библиотека `imageio-ffmpeg` для автоматической поставки `ffmpeg`. Отключены встроенные пост-процессоры `yt-dlp` (которые требуют `ffprobe`) и реализована ручная конвертация аудио через `ffmpeg` напрямую в `transcriber.py`.

## 2026-01-11
- **Полная очистка бэкенда**:
    - Убраны лишние логи.
    - Исправлены пути к файлам.

## 2026-01-12
- **Интеграция Gemini AI**:
    - Подключен Google Gemini API через `google-generativeai`.
    - Создан `gemini_service.py` для обработки видео и чата.
    - Реализована суммаризация видео (YouTube и локальные файлы) с использованием ИИ.
    - Добавлен fallback на локальную суммаризацию (BART) при ошибках API.
- **Улучшение рендеринга формул**:
    - Интегрированы `remark-math` и `rehype-katex` для отображения LaTeX формул в Markdown.
    - Добавлены стили KaTeX во фронтенд и бэкенд (для экспорта).
    - Настроен автоматический рендеринг формул в экспортируемом HTML.
    - **Оптимизация читаемости**: Улучшены CSS-стили для формул (цвет, размер, отступы), обновлен промпт ИИ для принудительного использования пробелов вокруг LaTeX-символов для корректного парсинга.
- **Экспорт в Word**:
    - Реализован экспорт конспектов в формат `.docx` с использованием библиотеки `python-docx`.
    - Добавлен эндпоинт `/generate-docx` на бэкенде с базовым парсингом Markdown.
225- **Экспорт в Word (Отменено)**:
226- **Исправление ошибок**:
227- Исправлена критическая ошибка `NameError: name 'R' is not defined` в `summarizer.py`. Ошибка возникала из-за использования f-строки для промпта, где `\mathbb{R}` интерпретировалось как обращение к переменной `R`. Исправлено путем экранирования фигурных скобок (`\mathbb{{R}}`).
228- **Удаление функций экспорта**:
229- По запросу пользователя полностью удалены функции экспорта конспектов в Word (.docx) и HTML.
230- Удалены эндпоинты `/generate-html` и `/generate-docx` на бэкенде.
231- Удалена логика скачивания и кнопки "Скачать HTML"/"Скачать Word" из интерфейса `AIChat.tsx`.
232- Очищены зависимости бэкенда от библиотек `markdown` и `python-docx`.
233- **Обновление UI AI чата**:
234- Страница `AIChat.tsx` теперь отображается на весь экран (без ограничения `max-w-md` на десктопе).
235- Скрыто нижнее навигационное меню (`BottomNav`) на странице чата.
236- Удалены фоновые декоративные элементы (blur blobs) и внешние отступы для страницы чата в `Layout.tsx`.
237- **Исправление прокрутки**:
238- Отключена прокрутка в родительском `Layout` для страницы `AIChat`, чтобы избежать "черного экрана" при скролле.
239- Внутренняя область чата теперь корректно занимает 100% высоты контейнера.
240- **Безопасность**:
241- Создан файл `.gitignore`.
242- Добавлен `.env` в `.gitignore` для предотвращения утечки API-ключей.
243- Добавлены стандартные исключения для Node.js (`node_modules`, `dist`) и Python (`__pycache__`, `venv`).
244- **Интерфейс и навигация**:
245- В [Review.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/Review.tsx) заголовок `h4` теперь отображает реальную тему видео (`note.title`).
246- Кнопка "отправить" в списке заметок теперь переводит пользователя в [AIChat.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/AIChat.tsx) с загруженным конспектом.
247- В [AIChat.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/AIChat.tsx) добавлена логика обработки `existingNote` из `location.state`.
248- **Улучшение заголовков конспектов**:
249- Бэкенд ([summarizer.py](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/backend/services/summarizer.py)) теперь возвращает словарь с `title` и `summary`. ИИ проинструктирован генерировать краткое название темы на первой строке.
250- Эндпоинт `/summarize` в [main.py](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/backend/main.py) теперь возвращает поле `title`.
251- Фронтенд сервис ([geminiService.ts](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/services/geminiService.ts)) и страница чата ([AIChat.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/AIChat.tsx)) обновлены для сохранения реального заголовка от ИИ вместо статичного "Конспект видео".
252- **Исправления интерфейса**:
253- **Восстановление Расписания**:
254- Восстановлен ручной список событий во вкладке [Schedule.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/Schedule.tsx).
255- Добавлены кнопки редактирования и удаления для событий расписания.
256- Реализовано сосуществование ручного списка и ИИ-анализа дня.
257- Исправлена инициализация дат в расписании (использование текущей даты вместо хардкода).
 258- **Исправление ошибок ИИ**:
 259- Исправлена критическая ошибка парсинга JSON в `analyzeSchedule`. ИИ иногда генерировал некорректные строки с одиночными обратными слешами (например, "Проект\б").
 260- Добавлена многоуровневая очистка JSON-ответа: удаление лишних запятых, экранирование одиночных слешей и удаление управляющих символов.
 261- Обновлен системный промпт для ИИ с требованием строгого соблюдения правил экранирования в JSON.
 262- **Изменение UI Расписания**:
 263- Скрыт ручной список событий и заголовок ("событий") по просьбе пользователя, чтобы оставить только AI-анализ.
 264- Обновлен промпт ИИ: теперь школьные уроки объединяются в один блок "Школа" с общим временем начала и конца, вместо перечисления каждого урока.
 265- **Шаблонизация плана дня**:
 266- Введен строгий шаблон для ИИ: подъем, приемы пищи и отбой теперь закреплены за временем из настроек пользователя и не меняются от дня к дню.
 270- **Исправление плана на выходные**: 
   - Исправлена передача даты в `analyzeSchedule`: теперь передается формат `yyyy-MM-dd` вместо локализованной строки "24 января", что вызывало ошибку `Invalid Date`.
   - Уточнен промпт для ИИ: теперь он явно требует включать шаблонные дела (подъем, еда, сон) в выходные и заполнять освободившееся от школы время полезными рекомендациями.
 269- **Исправление ошибок импорта**: Исправлена ошибка `format is not defined` в `geminiService.ts` путем добавления недостающих импортов `format` и `ru` из `date-fns`.
 253- Ширина карточек в списке заметок приведена к общему стандарту: добавлен `px-1` к контейнеру и увеличен внутренний отступ до `p-5` (как у остальных карточек).
 254- Исправлен рендеринг LaTeX формул в [AIChat.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/AIChat.tsx): улучшена функция `formatContent` для корректной обработки пробелов в инлайновых и блочных формулах.
255- В [Review.tsx](file:///c:/Users/алматы2/Desktop/Aidar's%20main/FocusPoint/src/pages/Review.tsx) заголовки карточек конспектов теперь переносятся на новую строку (`break-words`) вместо обрезания (`truncate`), чтобы длинные названия не нарушали структуру карточки.

## 2026-01-15
- **AI Schedule Analysis & Visualizer**:
    - Developed `AIScheduleAnalysis` component to provide intelligent insights into the user's daily schedule.
    - Integrated Gemini AI to identify free time slots ("gaps") and recommend personalized activities (rest, productivity, or activity).
    - Added a visual vertical timeline for free slots with icons and color-coded categories.
    - Implemented automatic analysis on date change (for today and future dates).
    - Updated `geminiService.ts` with `analyzeSchedule` method and unified backend port to `8001`.
    - Integrated the analysis component into the `Schedule.tsx` page, positioned below the events summary.
    - Added loading states and error handling for the AI analysis process.

## 2026-01-18
- **AI Schedule Stability**:
    - Disabled automatic schedule regeneration by AI on every entry or settings change.
    - AI now only generates a plan if none exists for the selected date.
    - Removed mock tasks and schedule items from the initial store state to prevent false change triggers.
- **Dynamic Date & Weekend Visibility**:
    - Implemented dynamic date display on the Dashboard using `date-fns` (formatted in Russian).
    - Added weekend detection logic (`isWeekend`).
    - **UI Update**: Hidden the "Today Stats" and "Schedule" sections on the Dashboard during weekends (Saturday and Sunday).
    - Updated the Schedule page header to show the date currently selected in the calendar strip instead of always showing "Today".
- **Recurring Activity Templates**:
    - Enhanced `AddScheduleModal` to support "Daily" and "Weekly" templates.
    - Recurring events are now automatically saved to `routineActivities` in the user settings.
    - Added visual feedback ("Сохранено!" on the button) when a recurring event is saved as a template.
- **Bug Fixes**:
    - Fixed date inconsistency between the Dashboard and Schedule pages.
    - Prevented duplicate entries in `routineActivities` when saving repeating events.
- **Schedule Recognition from Image**:
    - Integrated Gemini Vision API to recognize schedule from photos.
    - Added `recognize_schedule` endpoint to the FastAPI backend.
    - Implemented image upload and processing in `Profile.tsx`.
    - Updated `Dashboard.tsx` to dynamically display recognized subjects and classroom numbers (`room`).
    - Enhanced data types with `room` support for `ScheduleEvent`.
    - **New**: Added support for multi-day schedule recognition (Mon-Fri).
    - **New**: Added "Group" identification to filter subjects specifically for the user's group.
    - **New**: Automatically distributes recognized items to correct dates in the current week.

### 2026-01-18 (Session 2)

- **UI Refinement**:
    - Temporarily hidden the "Учеба" (School & Grade) section in `Profile.tsx` per user request.
- **Date Debugging/Verification**:
    - Temporarily overridden the "current date" in `Dashboard.tsx` and `Schedule.tsx` to **January 16th, 2026 (Friday)**.
    - This allows for testing and verifying the schedule display logic for a specific workday.
    - Updated "Today" indicator in the calendar to reflect Jan 16th.
- **Group Recognition Improvement**:
    - Added quick-selection buttons for "1 ГРУППА" and "2 ГРУППА" in the profile image upload section.
    - Enhanced AI prompt to better distinguish between subgroup-specific and common classes.
    - **Update**: Implemented specific table analysis logic: dividing the schedule into 5 horizontal blocks (days) and targeting specific vertical columns for groups (e.g., right column for "10S-2").
- **Onboarding Enhancements**:
    - Added study group selection (1 or 2 group) directly into the onboarding flow (Step 3).
    - Integrated AI schedule recognition into the onboarding process: users can now upload a schedule image, and it will be automatically parsed and added to their calendar before finishing registration.
    - Improved visual feedback with a loading spinner during AI recognition.
    - Group selection is saved to user settings during onboarding.
- **UI/UX Optimization**:
    - Fixed vertical scrolling issues on the Onboarding carousel.
    - Implemented a "Lock Height" approach using `100dvh` in `Layout.tsx` to prevent pages from stretching and forcing scroll on mobile devices.
    - Adjusted font sizes and padding in the onboarding slides to fit smaller screens without requiring a scroll.
    - Restricted overall container height to the viewport to ensure a "native app" feel.

### 2026-01-18 (Session 3)

- **Исправление логики колонок**:
    - Усилил инструкции для Gemini, чтобы исключить путаницу между 1-й и 2-й группами.
    - Явно прописал связь: Левая колонка = 1 Группа (10S-1), Правая колонка = 2 Группа (10S-2).
    - Добавил строгий запрет на извлечение данных из чужой колонки.

## 2026-01-22
- **Исправление работы ИИ (Gemini)**:
    - Добавлен отсутствующий метод `get_response` в `backend/services/gemini_service.py`.
    - Обновлен список моделей Gemini до актуальных версий (2.0 Flash/Pro).
    - Исправлен парсинг истории сообщений в чате (поддержка разных форматов структуры сообщения).
    - Улучшен промпт для распознавания расписания по фото:
        - Добавлена сетка звонков (уроки 40 мин, перемены 5-15 мин).
        - Усилены инструкции по разделению на 1 и 2 группы (игнорирование ненужной колонки).
- **Обновление Dashboard**:
    - Исправлен хардкод даты (заменено на текущую дату).
    - Реализовано отображение полного распорядка дня в основном блоке (уроки + личные пункты: подъем, завтрак, обед, ужин, сон).
    - Добавлена динамическая генерация событий типа `routine` на основе настроек пользователя.
    - Улучшена визуализация событий: разные цвета для уроков, рутины и доп. занятий.
- **Улучшение Профиля**:
    - Исправлено отображение имени и фамилии пользователя из стора.
    - Сделано переключение группы мгновенным (сохранение в стор при выборе).
- **Фильтрация и Логика**:
    - В блоке статистики теперь учитываются только школьные уроки (`type: school`).
    - В основном списке расписания отображаются все типы событий для полноты картины дня.
    - Исправлена ошибка `localeCompare` при отсутствии времени у события.
