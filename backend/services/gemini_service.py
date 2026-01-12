import google.generativeai as genai
from backend.config import GEMINI_API_KEY

class GeminiService:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.models_priority = [
            'gemini-1.5-flash',
            'gemini-3-pro-preview',
            'gemini-2.0-flash',
            'gemini-2.5-flash-lite'
        ]
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            print("ВНИМАНИЕ: GEMINI_API_KEY не установлен в .env")

    async def get_response(self, message: str, history=None):
        if not self.api_key:
            return "Ошибка: API-ключ Gemini не настроен. Пожалуйста, добавьте GEMINI_API_KEY в файл .env"
        
        last_error = ""
        for model_name in self.models_priority:
            try:
                print(f"Попытка запроса через модель: {model_name}...")
                model = genai.GenerativeModel(model_name)
                chat = model.start_chat(history=history or [])
                response = await chat.send_message_async(message)
                return response.text
            except Exception as e:
                error_msg = str(e)
                last_error = error_msg
                print(f"Ошибка модели {model_name}: {error_msg}")
                # Если ошибка 404 (модель не найдена) или 429 (квота), пробуем следующую
                if "404" in error_msg or "429" in error_msg or "not found" in error_msg.lower():
                    continue
                else:
                    # Если ошибка критическая (например, неверный ключ), прекращаем
                    break
        
        return f"К сожалению, все модели перегружены или недоступны. Последняя ошибка: {last_error}"

gemini_service = GeminiService()
