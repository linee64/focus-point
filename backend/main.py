import sys
import os

# Решение проблемы WinError 1114 и дублирования библиотек
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import markdown

# Добавляем корневую директорию в путь, чтобы импорты работали
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.transcriber import TranscriptionService
from backend.services.summarizer import SummarizationService
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
        print("Запуск интеллектуальной фильтрации и суммаризации...")
        summary = summarizer.summarize(text)
        
        return {
            "status": "ok",
            "transcription": text,
            "summary": summary
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Ошибка при суммаризации: {e}")
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка сервера: {str(e)}")

class HTMLGenerateRequest(BaseModel):
    markdown_text: str
    title: str = "Конспект видео"

@app.post("/generate-html")
async def generate_html(request: HTMLGenerateRequest):
    try:
        # Конвертируем Markdown в HTML
        html_content = markdown.markdown(request.markdown_text, extensions=['extra', 'nl2br', 'sane_lists'])
        
        # Обертка в полноценный HTML-документ со стилями
        full_html = f"""
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{request.title}</title>
            <style>
                :root {{
                    --bg: #0B0B0F;
                    --card: #18181B;
                    --text: #E4E4E7;
                    --primary: #8B5CF6;
                    --secondary: #A78BFA;
                }}
                body {{
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: var(--bg);
                    color: var(--text);
                    line-height: 1.6;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }}
                .container {{
                    background-color: var(--card);
                    padding: 40px;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }}
                h1 {{
                    color: var(--primary);
                    font-size: 2.5em;
                    margin-bottom: 0.5em;
                    border-bottom: 2px solid rgba(139, 92, 246, 0.2);
                    padding-bottom: 10px;
                }}
                h2 {{
                    color: var(--secondary);
                    margin-top: 1.5em;
                    font-size: 1.8em;
                }}
                ul, ol {{
                    padding-left: 20px;
                }}
                li {{
                    margin-bottom: 10px;
                }}
                strong {{
                    color: #fff;
                }}
                code {{
                    background: rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: monospace;
                }}
                .footer {{
                    margin-top: 50px;
                    text-align: center;
                    font-size: 0.8em;
                    color: #71717A;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                {html_content}
            </div>
            <div class="footer">
                Сгенерировано с помощью SleamAI • {request.title}
            </div>
        </body>
        </html>
        """
        
        return Response(
            content=full_html,
            media_type="text/html",
            headers={
                "Content-Disposition": f"attachment; filename=summary.html"
            }
        )
    except Exception as e:
        print(f"Ошибка при генерации HTML: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
