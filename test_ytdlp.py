import yt_dlp
import os

url = "https://www.youtube.com/watch?v=jNQXAC9IVRw"
ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': 'test_audio.%(ext)s',
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        print(f"Testing download for {url}...")
        ydl.download([url])
        print("Download successful!")
except Exception as e:
    print(f"Download failed: {e}")
finally:
    if os.path.exists("test_audio.webm"): os.remove("test_audio.webm")
    if os.path.exists("test_audio.m4a"): os.remove("test_audio.m4a")
