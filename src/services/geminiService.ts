/**
 * Сервис для анализа видео через локальный бэкенд
 */

export const analyzeVideo = async (videoSource: string | File, isUrl: boolean = true) => {
  if (!isUrl) {
    // Демо-режим для локальных файлов (загрузка через браузер)
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `# 📁 Конспект файла: ${(videoSource as File).name}\n\n## 🎯 Анализ загруженного видео завершен.\n\n*(В этой версии анализ локальных файлов работает в режиме демонстрации)*`;
  }

  try {
    // Используем наш бэкенд для транскрибации и суммаризации
    const response = await fetch('http://127.0.0.1:8002/summarize', {
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
    
    // Возвращаем структурированный конспект
    return data.summary;
  } catch (error: any) {
    console.error("Error in analyzeVideo:", error);
    
    if (error.message?.includes("Failed to fetch")) {
      throw new Error("Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен (python -m uvicorn backend.main:app --port 8002)");
    }
    
    throw new Error(error.message || "Произошла ошибка при обработке видео на сервере.");
  }
};
