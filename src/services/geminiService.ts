const BASE_URL = 'http://127.0.0.1:8001';

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
      throw new Error(`Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен (python -m uvicorn backend.main:app --port 8001)`);
    }
    
    throw new Error(error.message || "Произошла ошибка при обработке видео на сервере.");
  }
};

export const chatWithAI = async (message: string, history: any[] = []) => {
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
    throw new Error(error.message || "Не удалось получить ответ от ИИ.");
  }
};

export interface PlanItem {
  start: string;
  end: string;
  title: string;
  type: 'rest' | 'productivity' | 'activity' | 'routine' | 'school' | 'sleep' | 'meal';
  isRecommendation: boolean;
}

export interface ScheduleAnalysis {
  analysis: string;
  plan: PlanItem[];
}

export const analyzeSchedule = async (date: string, schedule: any[], settings: any): Promise<ScheduleAnalysis> => {
  const prompt = `
    Проанализируй мой график на ${date} и составь ПОЛНЫЙ идеальный план дня.
    
    Мои настройки дня:
    - Подъем: ${settings.wakeUpTime}
    - Отбой: ${settings.bedTime}
    - Завтрак: ${settings.breakfastTime}
    - Обед: ${settings.lunchTime}
    - Ужин: ${settings.dinnerTime}
    - Школа: ${settings.schoolStart} - ${settings.schoolEnd}
    - Время в пути до школы: ${settings.commuteTime} минут

    Мои постоянные активности (шаблон):
    ${(settings?.routineActivities || []).length > 0 
      ? settings.routineActivities.map((a: any) => `- ${a.startTime} - ${a.endTime}: ${a.title}`).join('\n')
      : 'Нет постоянных активностей'}

    Мои существующие активности на этот конкретный день:
    ${(schedule || []).length > 0 ? schedule.map(e => `- ${e.startTime} - ${e.endTime}: ${e.title} (${e.type})`).join('\n') : 'Нет специфических активностей'}

    Твоя задача:
    1. Составь последовательный план дня с момента подъема до отбоя.
    2. ОБЯЗАТЕЛЬНО включи время в пути ДО и ПОСЛЕ школы (по ${settings.commuteTime} мин).
    3. ВКЛЮЧИ в план все мои постоянные активности, рутинные дела (сон, еда, школа) и специфические активности на день.
    4. Все, что указано в настройках и существующем графике, должно стоять в плане по умолчанию (isRecommendation: false).
    5. Найди свободные промежутки времени и ЗАПОЛНИ их полезными рекомендациями (isRecommendation: true).
    6. Дай общий краткий совет по продуктивности на этот день.

    ОТВЕТЬ СТРОГО В ФОРМАТЕ JSON. Не пиши ничего, кроме JSON.
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
    
    // Удаление лишних запятых перед закрывающими скобками (частая ошибка ИИ)
    jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');

    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse JSON:", jsonStr);
      console.error("Original response:", response);
      throw new Error("Ошибка при обработке плана дня. Попробуйте еще раз.");
    }
  } catch (error) {
    console.error("Error in analyzeSchedule:", error);
    throw error;
  }
};
