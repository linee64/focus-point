import sys
import os

# Решение проблемы WinError 1114 и дублирования библиотек
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Добавляем корневую директорию в путь, чтобы импорты работали
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.transcriber import TranscriptionService
from backend.services.summarizer import SummarizationService
from backend.services.gemini_service import gemini_service
from backend.config import HOST, PORT

app = FastAPI(title="FocusPoint Transcription & Summarization API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация сервисов
transcriber = TranscriptionService()
summarizer = SummarizationService()

class TranscribeRequest(BaseModel):
    url: str

@app.post("/transcribe")
async def transcribe_video(request: TranscribeRequest):
    try:
        text = transcriber.process(request.url)
        return {
            "status": "ok",
            "transcription": text
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Ошибка при транскрибации: {e}")
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")

@app.post("/summarize")
async def summarize_video(request: TranscribeRequest):
    try:
        # 1. Сначала транскрибируем
        print(f"\n{'='*50}")
        print(f"ПОЛУЧЕН ЗАПРОС НА СУММАРИЗАЦИЮ: {request.url}")
        text = transcriber.process(request.url)
        
        if not text or "Ошибка:" in text:
            print(f"ОШИБКА ТРАНСКРИБАЦИИ: {text}")
            raise HTTPException(status_code=400, detail=f"Не удалось получить текст видео: {text}")

        print(f"\n--- ИСХОДНЫЙ ТЕКСТ ИЗ СУБТИТРОВ ---")
        print(text)
        print(f"--- КОНЕЦ ИСХОДНОГО ТЕКСТА ---\n")

        # 2. Затем суммаризируем
        print("Запуск ИИ-суммаризации через Gemini...")
        result = await summarizer.summarize_with_ai(text)
        
        return {
            "status": "ok",
            "transcription": text,
            "summary": result["summary"],
            "title": result["title"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ошибка при суммаризации: {e}")
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")

@app.post("/recognize-schedule")
async def recognize_schedule(file: UploadFile = File(...), group: str = ""):
    try:
        content = await file.read()
        result = await gemini_service.recognize_schedule_from_image(content, file.content_type, group)
        if result is None:
            raise HTTPException(status_code=500, detail="Не удалось распознать расписание")
        return {"status": "ok", "schedule": result}
    except Exception as e:
        print(f"Ошибка при распознавании расписания: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        response = await gemini_service.get_response(request.message, request.history)
        return {"status": "ok", "response": response}
    except Exception as e:
        print(f"Ошибка в чате: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
