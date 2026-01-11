from faster_whisper import WhisperModel
import os

MODELS_DIR = os.path.join(os.getcwd(), "backend", "temp", "models")
audio_file = os.path.join(os.getcwd(), "backend", "temp", "cc64de95-5bfa-486c-8cb2-d124dce0c306.webm")

print("Loading model...")
model = WhisperModel("tiny", device="cpu", compute_type="float32", download_root=MODELS_DIR)
print("Model loaded.")

if os.path.exists(audio_file):
    print(f"Transcribing {audio_file}...")
    segments, info = model.transcribe(audio_file, beam_size=1)
    for segment in segments:
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
else:
    print(f"File {audio_file} not found.")
