import whisper
import os

MODELS_DIR = os.path.join(os.getcwd(), "backend", "temp", "models")
# Используем один из скачанных файлов
audio_file = os.path.join(os.getcwd(), "backend", "temp", "cc64de95-5bfa-486c-8cb2-d124dce0c306.webm")

print("Loading model...")
model = whisper.load_model("tiny", device="cpu", download_root=MODELS_DIR)
print("Model loaded.")

if os.path.exists(audio_file):
    print(f"Transcribing {audio_file}...")
    result = model.transcribe(audio_file)
    print("Result:", result.get("text"))
else:
    print(f"File {audio_file} not found.")
