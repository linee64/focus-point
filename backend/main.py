import sys
import os

# Решение проблемы WinError 1114 и дублирования библиотек
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Добавляем корневую директорию в путь, чтобы импорты работали
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.transcriber import TranscriptionService
from backend.config import HOST, PORT

app = FastAPI(title="FocusPoint Transcription API")

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

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
