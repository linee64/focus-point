import os
import uuid
import yt_dlp
import imageio_ffmpeg
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

# Используем pywhispercpp (whisper.cpp), так как он не зависит от torch
try:
    from pywhispercpp.model import Model
    WHISPER_AVAILABLE = True
except Exception as e:
    print(f"Whisper не загружен: {e}")
    WHISPER_AVAILABLE = False

from backend.config import TEMP_DIR, MODELS_CPP_DIR, WHISPER_MODEL_SIZE
from backend.utils import clean_text, extract_video_id

class TranscriptionService:
    def __init__(self):
        self.whisper_model = None

    def get_subtitles(self, video_id: str) -> str:
        """Пытается получить субтитры через YouTube API."""
        try:
            # В версии 1.2.3+ нужно создавать экземпляр API
            api = YouTubeTranscriptApi()
            transcript_list = api.list(video_id)
            
            # Приоритет: авторские (ru/en), потом любые другие, потом авто-генерация
            try:
                transcript = transcript_list.find_manually_created_transcript(['ru', 'en'])
            except:
                try:
                    transcript = transcript_list.find_generated_transcript(['ru', 'en'])
                except:
                    # Берем первый попавшийся
                    transcript = next(iter(transcript_list))
            
            data = transcript.fetch()
            # Обработка разных версий API (могут быть словари или объекты)
            texts = []
            for item in data:
                if isinstance(item, dict):
                    texts.append(item.get('text', ''))
                else:
                    texts.append(getattr(item, 'text', ''))
            
            text = " ".join(texts)
            return clean_text(text)
        except (TranscriptsDisabled, NoTranscriptFound, Exception) as e:
            print(f"Субтитры не найдены или отключены: {e}")
            return ""

    def download_audio(self, url: str) -> str:
        """Скачивает аудио из видео с максимальной скоростью."""
        print(f"Начало скачивания аудио: {url}")
        file_id = str(uuid.uuid4())
        
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

        ydl_opts = {
            'format': 'bestaudio[abr<=96]/bestaudio',
            'outtmpl': os.path.join(TEMP_DIR, f"{file_id}.%(ext)s"),
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            'concurrent_fragment_downloads': 10,
            'ffmpeg_location': ffmpeg_path,
            'nocheckcertificate': True,
            'ignoreerrors': False,
            'log_tostderr': False,
            'no_color': True,
            'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                temp_file = ydl.prepare_filename(info)
                
                # Конвертируем в 16000Hz mono WAV через ffmpeg напрямую
                final_wav = os.path.join(TEMP_DIR, f"{file_id}_16k.wav")
                print(f"Конвертация в 16000Hz mono WAV: {final_wav}")
                
                import subprocess
                # Используем список для безопасности
                cmd = [
                    ffmpeg_path,
                    '-y',
                    '-i', temp_file,
                    '-ar', '16000',
                    '-ac', '1',
                    final_wav
                ]
                
                # Запускаем без shell=True для надежности на Windows
                subprocess.run(cmd, check=True, capture_output=True)
                
                # Удаляем исходный скачанный файл (если он не .wav)
                if temp_file != final_wav and os.path.exists(temp_file):
                    os.remove(temp_file)
                    
                print(f"Аудио готово: {final_wav}")
                return final_wav
        except Exception as e:
            print(f"Ошибка при загрузке/конвертации аудио: {e}")
            return ""

    def transcribe_local(self, audio_path: str) -> str:
        """Транскрибирует аудио через pywhispercpp."""
        if not WHISPER_AVAILABLE:
            print("Транскрибация невозможна: Whisper не загружен.")
            return ""

        print(f"Начало транскрибации файла: {audio_path}")
        try:
            if self.whisper_model is None:
                print(f"Загрузка модели Whisper ({WHISPER_MODEL_SIZE})...")
                self.whisper_model = Model(WHISPER_MODEL_SIZE, models_dir=MODELS_CPP_DIR)
                print("Модель загружена.")
            
            print("Запуск распознавания...")
            # pywhispercpp возвращает список объектов сегментов
            segments = self.whisper_model.transcribe(audio_path)
            text = " ".join([s.text for s in segments])
            print("Транскрибация завершена.")
        except Exception as e:
            print(f"Ошибка при транскрибации: {e}")
            text = ""
        finally:
            # Удаляем временный файл
            if os.path.exists(audio_path):
                os.remove(audio_path)
            
        return clean_text(text)

    def process(self, url: str) -> str:
        """Основной метод обработки: субтитры -> транскрибация."""
        video_id = extract_video_id(url)
        if not video_id:
            return "Ошибка: Неверный URL YouTube"

        # 1. Пробуем получить субтитры
        print(f"Пробуем получить субтитры для {video_id}...")
        text = self.get_subtitles(video_id)
        if text:
            print("Субтитры успешно получены.")
            return text

        # 2. Если субтитров нет, скачиваем аудио и транскрибируем
        print("Субтитры не найдены, переходим к локальной транскрибации...")
        audio_path = self.download_audio(url)
        if audio_path:
            return self.transcribe_local(audio_path)
        
        return "Ошибка: Не удалось получить текст видео (субтитры отсутствуют, а загрузка аудио не удалась)"
