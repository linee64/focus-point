import google.generativeai as genai
from backend.config import GEMINI_API_KEY

class GeminiService:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.models_priority = [
            'gemini-2.5-flash-lite',
            'gemini-2.5-flash',
            'gemini-2.0-flash-lite-preview-02-05',
            'gemini-2.0-flash'
        ]
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            print("ВНИМАНИЕ: GEMINI_API_KEY не установлен в .env")

    async def recognize_schedule_from_image(self, image_data: bytes, mime_type: str, group: str = ""):
        if not self.api_key:
            return None
        
        prompt = f"""
        Проанализируй это изображение расписания занятий. 
        Группа пользователя: {group if group else "не указана"}.
        Извлеки список предметов для этой группы на всю неделю (пн-пт).
        
        СТРУКТУРА РАСПИСАНИЯ:
        1. Дни недели расположены в виде пяти горизонтальных блоков сверху вниз:
           - 1-й блок (самый верхний) — Понедельник
           - 2-й блок — Вторник
           - 3-й блок — Среда
           - 4-й блок — Четверг
           - 5-й блок — Пятница
        
        2. Колонки групп (КРИТИЧЕСКИ ВАЖНО):
           - Каждая строка с предметами разделена на две основные колонки.
           - ЛЕВАЯ КОЛОНКА всегда соответствует "1 Группе" (например, 10S-1, 9O-1, 11A-1).
           - ПРАВАЯ КОЛОНКА всегда соответствует "2 Группе" (например, 10S-2, 9O-2, 11A-2).
           - Если пользователь выбрал "1 группа", бери данные ТОЛЬКО из ЛЕВОЙ колонки.
           - Если пользователь выбрал "2 группа", бери данные ТОЛЬКО из ПРАВОЙ колонки.
           - Если ячейка предмета одна на всю ширину (общая для обеих групп), бери её в любом случае.
           - НИКОГДА не бери предмет из правой колонки, если нужна 1 группа, и наоборот.
        
        3. Формат ячеек внутри колонки:
           - Широкая ячейка содержит название предмета и инициалы учителя.
           - Узкая ячейка справа от названия содержит номер кабинета.
        
        ЗАДАЧА:
        1. Определи день недели по горизонтальному блоку.
        2. Выбери нужную колонку в зависимости от группы пользователя ({group}).
        3. Извлеки название предмета (title), время (если указано в начале строки или блока, иначе используй стандартное школьное время) и номер кабинета (room).
        4. Если предмет общий (занимает обе колонки), включи его.
        
        Верни список предметов в формате JSON.
        Для каждого предмета укажи:
        - title: название предмета (без инициалов учителя)
        - start: время начала (формат HH:mm)
        - end: время окончания (формат HH:mm)
        - room: номер кабинета (из узкой ячейки справа)
        - day: день недели (одно из: "понедельник", "вторник", "среда", "четверг", "пятница")
        - type: всегда "school"
        
        Верни ТОЛЬКО массив JSON объектов.
        """
        
        for model_name in self.models_priority:
            try:
                model = genai.GenerativeModel(model_name)
                response = await model.generate_content_async([
                    prompt,
                    {'mime_type': mime_type, 'data': image_data}
                ])
                
                # Очистка от markdown блоков если есть
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:-3].strip()
                elif text.startswith("```"):
                    text = text[3:-3].strip()
                
                import json
                return json.loads(text)
            except Exception as e:
                print(f"Ошибка Vision в модели {model_name}: {e}")
                continue
        
        return None

gemini_service = GeminiService()
