import os
from dotenv import load_dotenv

load_dotenv()

# Директории
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, "temp")
MODELS_DIR = os.path.join(TEMP_DIR, "models")
MODELS_CPP_DIR = os.path.join(TEMP_DIR, "models_cpp")

# Создаем директории, если их нет
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(MODELS_CPP_DIR, exist_ok=True)

# Настройки Whisper
WHISPER_MODEL_SIZE = "tiny" # Для максимальной скорости на MVP
WHISPER_DEVICE = "cpu"      # Можно поменять на "cuda", если есть GPU
WHISPER_COMPUTE_TYPE = "float32" # float32 более стабилен на Windows CPU

# Настройки сервера
HOST = "0.0.0.0"
PORT = int(os.getenv("PORT", 8001))

# Настройки ИИ
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
