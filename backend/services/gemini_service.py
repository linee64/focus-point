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
        
        # Определяем, какую колонку искать на основе группы
        group_focus = ""
        is_group_2 = "2" in group
        
        if is_group_2:
            group_focus = """
            ВНИМАНИЕ: Пользователь из 2 ГРУППЫ. 
            Твоя задача — игнорировать левую колонку с предметами.
            Бери данные ТОЛЬКО из ПРАВОЙ колонки в каждой строке.
            Если в ячейке написано два предмета (например, через дробь / или в разных частях ячейки), бери тот, что СПРАВА.
            """
        else:
            group_focus = """
            ВНИМАНИЕ: Пользователь из 1 ГРУППЫ.
            Бери данные ТОЛЬКО из ЛЕВОЙ колонки в каждой строке.
            Если в ячейке написано два предмета, бери тот, что СЛЕВА.
            """

        prompt = f"""
        Проанализируй это изображение расписания занятий. 
        Группа пользователя: {group if group else "не указана"}.
        {group_focus}
        
        Извлеки список предметов на всю неделю (пн-пт).
        
        КРИТИЧЕСКИЕ ПРАВИЛА РАЗДЕЛЕНИЯ ГРУПП:
        1. Таблица разделена вертикально на две части для каждой строки.
        2. ЛЕВАЯ часть ячейки/строки = 1 ГРУППА.
        3. ПРАВАЯ часть ячейки/строки = 2 ГРУППА.
        4. Если ячейка цельная (на всю ширину) — этот предмет общий для обеих групп.
        5. ОШИБКА ЗАПРЕЩЕНА: Не перепутай колонки. Если пользователь во 2-й группе, ты ДОЛЖЕН проигнорировать первый (левый) предмет в строке и взять второй (правый).

        ПРАВИЛА ВРЕМЕНИ (СЕТКА ЗВОНКОВ):
        - Длительность одного урока: 40 минут.
        - Перемены между уроками:
          1. После 1-го урока: 5 минут
          2. После 2-го урока: 10 минут
          3. После 3-го урока: 10 минут
          4. После 4-го урока: 15 минут
          5. После 5-го урока: 10 минут
          6. После 6-го урока: 10 минут
        
        Если в расписании указан только номер урока (например, "1 урок") или только время начала, используй эту сетку для расчета точного времени начала (start) и конца (end).
        Обычно занятия начинаются в 08:00 или 08:30. Если время начала первого урока на фото другое, адаптируй всю сетку.
        
        СТРУКТУРА РАСПИСАНИЯ:
        1. Дни недели расположены горизонтальными блоками.
        
        2. Колонки групп (КРИТИЧЕСКИ ВАЖНО):
           - Каждая строка с предметами разделена на две основные колонки.
           - ЛЕВАЯ КОЛОНКА всегда соответствует "1 Группе" (10S-1, 9O-1 и т.д.).
           - ПРАВАЯ КОЛОНКА всегда соответствует "2 Группе" (10S-2, 9O-2 и т.д.).
           - Если пользователь выбрал "1 группа", бери данные ТОЛЬКО из ЛЕВОЙ колонки.
           - Если пользователь выбрал "2 группа", бери данные ТОЛЬКО из ПРАВОЙ колонки.
           - Если ячейка предмета одна на всю ширину (общая), бери её.
        
        3. Формат ячеек:
           - Название предмета и кабинет.
        
        ЗАДАЧА:
        1. Определи день недели.
        2. Выбери нужную колонку в зависимости от группы ({group}).
        3. Извлеки название предмета (title), время (start/end) и кабинет (room).
        
        Верни список предметов в формате JSON:
        [
          {{"title": "...", "start": "HH:mm", "end": "HH:mm", "room": "...", "day": "понедельник", "type": "school"}},
          ...
        ]
        Верни ТОЛЬКО массив JSON.
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
                print(f"Ошибка Vision в модели {model_name}: {str(e)}")
                if "429" in str(e):
                    print(f"Лимит запросов для {model_name}")
                elif "403" in str(e):
                    print(f"Ошибка доступа/API ключа для {model_name}")
                continue
        
        return None

    async def get_response(self, message: str, history: list = []):
        if not self.api_key:
            return "GEMINI_API_KEY не настроен."

        for model_name in self.models_priority:
            try:
                model = genai.GenerativeModel(model_name)
                # Преобразуем историю в формат Google Generative AI
                chat_history = []
                for msg in history:
                    role = "user" if msg["role"] == "user" else "model"
                    
                    # Извлекаем текст из различных возможных форматов сообщения
                    content = ""
                    if isinstance(msg.get("content"), str):
                        content = msg["content"]
                    elif isinstance(msg.get("parts"), list):
                        # Собираем текст из всех частей
                        parts_texts = []
                        for p in msg["parts"]:
                            if isinstance(p, dict) and "text" in p:
                                parts_texts.append(p["text"])
                            elif isinstance(p, str):
                                parts_texts.append(p)
                        content = " ".join(parts_texts)
                    
                    if content:
                        chat_history.append({"role": role, "parts": [content]})
                
                chat = model.start_chat(history=chat_history)
                response = await chat.send_message_async(message)
                return response.text
            except Exception as e:
                print(f"Ошибка Chat в модели {model_name}: {str(e)}")
                if "429" in str(e):
                    print(f"Лимит запросов для {model_name}")
                elif "403" in str(e):
                    print(f"Ошибка доступа/API ключа для {model_name}")
                continue
        
        return "Извините, возникла ошибка при обработке запроса. Пожалуйста, попробуйте позже."

gemini_service = GeminiService()
