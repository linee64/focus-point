import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { GoogleGenerativeAI } from "@google/generative-ai";

const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const BASE_URL = isVercel ? '' : `http://${window.location.hostname}:8001`;

// Инициализация Gemini API для прямого доступа (используется если бэкенд недоступен)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY && isVercel) {
  console.error("КРИТИЧЕСКАЯ ОШИБКА: VITE_GEMINI_API_KEY не найден в переменных окружения Vercel!");
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Хелпер для конвертации файла в формат Gemini
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

/**
 * Сервис для анализа видео через локальный бэкенд
 */

export const analyzeVideo = async (videoSource: string | File, isUrl: boolean = true): Promise<{ summary: string; title: string }> => {
  if (!isUrl) {
    // Демо-режим для локальных файлов (загрузка через браузер)
    await new Promise(resolve => setTimeout(resolve, 2000));
    const title = (videoSource as File).name;
    const summary = `# 📁 Конспект файла: ${title}\n\n## 🎯 Анализ загруженного видео завершен.\n\n*(В этой версии анализ локальных файлов работает в режиме демонстрации)*`;
    return { summary, title };
  }

  // Если мы на Vercel, обработка видео (транскрибация) через этот метод недоступна без бэкенда
  if (isVercel) {
    throw new Error("Анализ видео временно недоступен на Vercel (требуется Python-сервер для транскрибации).");
  }

  try {
    // Используем наш бэкенд для транскрибации и суммаризации
    const response = await fetch(`${BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: videoSource }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при обработке видео на бэкенде');
    }

    const data = await response.json();
    
    // Возвращаем структурированный конспект и заголовок
    return {
      summary: data.summary,
      title: data.title || "Конспект видео"
    };
  } catch (error: any) {
    console.error("Error in analyzeVideo:", error);
    
    if (error.message?.includes("Failed to fetch")) {
      throw new Error(`Не удалось подключиться к серверу для обработки видео. На Vercel эта функция требует запущенного бэкенда или использования YouTube URL (если настроено).`);
    }
    
    throw new Error(error.message || "Произошла ошибка при обработке видео на сервере.");
  }
};

export const chatWithAI = async (message: string, history: any[] = []) => {
  // Пытаемся вызвать Gemini напрямую, если есть API ключ (для Vercel)
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: history.length > 0 ? history : [],
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (directError: any) {
      console.warn("Direct Gemini API call failed, falling back to backend:", directError);
      // Если ошибка в ключе или лимитах, пробрасываем её
      if (directError.message?.includes("API_KEY_INVALID") || directError.message?.includes("quota")) {
        throw directError;
      }
    }
  }

  // Если мы на Vercel и нет ключа, даже не пытаемся стучаться на localhost
  if (isVercel && !genAI) {
    throw new Error("ИИ недоступен: Добавьте VITE_GEMINI_API_KEY в настройки Vercel.");
  }

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при общении с ИИ');
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Error in chatWithAI:", error);
    if (error.message?.includes("Failed to fetch")) {
      throw new Error("Не удалось подключиться к ИИ. Убедитесь, что бэкенд запущен или добавлен VITE_GEMINI_API_KEY.");
    }
    throw new Error(error.message || "Не удалось получить ответ от ИИ.");
  }
};

/**
 * Распознает расписание по изображению через бэкенд
 */
export const recognizeScheduleFromImage = async (imageFile: File, group: string = ""): Promise<PlanItem[]> => {
  // Пытаемся использовать прямой API Gemini если есть ключ
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const imageData = await fileToGenerativePart(imageFile);
      
      const group_focus = group.includes("2") 
        ? "ВНИМАНИЕ: Пользователь из 2 ГРУППЫ. Игнорируй левую колонку, бери данные ТОЛЬКО из ПРАВОЙ колонки."
        : "ВНИМАНИЕ: Пользователь из 1 ГРУППЫ. Бери данные ТОЛЬКО из ЛЕВОЙ колонки.";

      const prompt = `
        Проанализируй это изображение расписания. Группа: ${group}.
        ${group_focus}
        Извлеки предметы (title), время (start, end), кабинет (room) и день недели (day).
        Верни ТОЛЬКО массив JSON в формате:
        [{"title": "...", "start": "HH:mm", "end": "HH:mm", "room": "...", "day": "понедельник"}]
      `;

      const result = await model.generateContent([prompt, imageData]);
      const response = result.response.text();
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const schedule = JSON.parse(cleanJson);
      
      return schedule.map((item: any) => ({
        ...item,
        type: 'school',
        isRecommendation: false
      }));
    } catch (directError) {
      console.warn("Direct Gemini vision API call failed, falling back to backend:", directError);
    }
  }

  // Если мы на Vercel и нет ключа, даже не пытаемся стучаться на localhost
  if (isVercel && !genAI) {
    throw new Error("Распознавание недоступно: Добавьте VITE_GEMINI_API_KEY в настройки Vercel.");
  }

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('group', group);

  try {
    const response = await fetch(`${BASE_URL}/recognize-schedule`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при распознавании расписания');
    }

    const data = await response.json();
    return data.schedule.map((item: any) => ({
      start: item.start,
      end: item.end,
      title: item.title,
      room: item.room,
      day: item.day,
      type: 'school',
      isRecommendation: false
    }));
  } catch (error: any) {
    console.error("Error in recognizeScheduleFromImage:", error);
    if (error.message?.includes("Failed to fetch")) {
      throw new Error("Не удалось подключиться к серверу распознавания. Добавьте VITE_GEMINI_API_KEY для прямой работы без бэкенда.");
    }
    throw new Error(error.message || "Не удалось распознать расписание.");
  }
};

export interface PlanItem {
  start: string;
  end: string;
  title: string;
  type: 'rest' | 'productivity' | 'activity' | 'routine' | 'school' | 'sleep' | 'meal';
  isRecommendation: boolean;
  room?: string;
  day?: string;
}

export interface ScheduleAnalysis {
  analysis: string;
  plan: PlanItem[];
}

export const analyzeSchedule = async (date: string, schedule: any[], settings: any): Promise<ScheduleAnalysis> => {
  const dateObj = new Date(date);
  const formattedDateForAI = format(dateObj, 'd MMMM', { locale: ru });
  const dayName = format(dateObj, 'EEEE', { locale: ru });
  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

  const prompt = `
    Проанализируй мой график на ${formattedDateForAI} (${dayName}) и составь ПОЛНЫЙ идеальный план дня.
    
    ВАЖНО: Следующие активности являются ШАБЛОНОМ. Они ДОЛЖНЫ быть в плане каждый день строго в указанное время:
    - Подъем: ${settings.wakeUpTime}
    - Отбой: ${settings.bedTime}
    - Завтрак: ${settings.breakfastTime}
    - Обед: ${settings.lunchTime}
    - Ужин: ${settings.dinnerTime}
    
    ШКОЛА:
    ${isWeekend 
      ? "- Сегодня ВЫХОДНОЙ (суббота или воскресенье), поэтому ШКОЛЫ И ПУТИ ДО НЕЕ НЕТ. НЕ ВКЛЮЧАЙ школу в план." 
      : `- Школа: ${settings.schoolStart} - ${settings.schoolEnd} (обязательно включи время в пути по ${settings.commuteTime} мин до и после)`}

    Мои постоянные активности (шаблон):
    ${(() => {
      const dayNum = dateObj.getDay(); // 0-6, 0 is Sunday
      const ruDayNum = dayNum === 0 ? 7 : dayNum; // Convert to 1-7 (Mon-Sun)
      
      const relevantRoutines = (settings?.routineActivities || []).filter((a: any) => 
        !a.days || a.days.length === 0 || a.days.includes(ruDayNum)
      );
      
      return relevantRoutines.length > 0 
        ? relevantRoutines.map((a: any) => `- ${a.startTime} - ${a.endTime}: ${a.title}`).join('\n')
        : 'Нет дополнительных постоянных активностей на этот день';
    })()}

    Мои специфические активности на этот конкретный день (из расписания):
    ${(schedule || []).length > 0 ? schedule.map(e => `- ${e.startTime} - ${e.endTime}: ${e.title} (${e.type})`).join('\n') : 'Нет специфических активностей'}

    Твоя задача:
    1. Составь последовательный план дня с момента подъема до отбоя.
    2. Используй ШАБЛОН выше (подъем, еда, отбой) как незыблемую основу. Они ДОЛЖНЫ быть в плане каждый день, включая выходные.
    3. ОБЯЗАТЕЛЬНО ВЫДЕЛИ МИНИМУМ 2 ЧАСА В ДЕНЬ НА ДОМАШНЮЮ РАБОТУ (Homework). 
       - Разбей это время на 2 отдельных блока по 1 часу каждый.
       - Распредели эти блоки гармонично в течение дня (например, один днем после школы/обеда, другой вечером перед ужином), чтобы не перегружать меня.
       - Используй type: "productivity" и title: "Домашняя работа" для этих блоков.
    4. ${isWeekend 
        ? "В плане НЕ ДОЛЖНО быть школы и времени в пути. Заполни это время отдыхом или полезными делами." 
        : 'ОБЯЗАТЕЛЬНО объедини все школьные уроки в один блок "Школа" с общим временем начала и конца. Включи время в пути.'}
    4. ВКЛЮЧИ в план все мои постоянные и специфические активности.
    5. Все шаблонные и мои активности должны иметь isRecommendation: false.
    6. ЗАПОЛНИ все свободное время (которого в выходные будет гораздо больше) интересными и полезными рекомендациями (isRecommendation: true) для отдыха, саморазвития или хобби. План должен быть насыщенным и полным, а не пустым!
    7. Дай общий краткий совет по продуктивности на этот день.

    ОТВЕТЬ СТРОГО В ФОРМАТЕ JSON. Не пиши ничего, кроме JSON. 
    ВАЖНО: Избегай специальных символов в строках (кавычки, обратные слеши). Если они необходимы, экранируй их правильно (\\).
    Пример структуры:
    {
      "analysis": "краткий текст анализа дня",
      "plan": [
        {
          "start": "08:00",
          "end": "08:30",
          "title": "Завтрак",
          "type": "meal",
          "isRecommendation": false
        }
      ]
    }
    
    Допустимые значения для "type": "rest", "productivity", "activity", "routine", "school", "sleep", "meal".
  `;

  try {
    const response = await chatWithAI(prompt);
    
    // Очистка ответа от возможных markdown-тегов ```json ... ```
    const cleanResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI Response was:", response);
      throw new Error("ИИ вернул некорректный формат данных");
    }
    
    let jsonStr = jsonMatch[0];
    
    // Очистка JSON от типичных ошибок ИИ
    jsonStr = jsonStr
      .replace(/,\s*([\]}])/g, '$1') // Удаление лишних запятых
      .replace(/\\(?!["\\\/bfnrtu])/g, '\\\\'); // Экранирование одиночных обратных слешей

    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      // Попытка еще более агрессивной очистки если первый раз не вышло
      try {
        const ultraClean = jsonStr
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Удаление невидимых управляющих символов
          .replace(/\\/g, "\\\\") // Экранируем ВСЕ слеши (рискованно, но может помочь)
          .replace(/\\\\"/g, "\\\""); // Возвращаем экранированные кавычки обратно
        return JSON.parse(ultraClean);
      } catch (e) {
        console.error("Failed to parse JSON even after cleaning:", jsonStr);
        console.error("Original response:", response);
        throw new Error("Ошибка при обработке плана дня. Попробуйте еще раз.");
      }
    }
  } catch (error) {
    console.error("Error in analyzeSchedule:", error);
    throw error;
  }
};
