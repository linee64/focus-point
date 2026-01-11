import requests
import time

def test_transcribe(video_url, description):
    api_url = "http://127.0.0.1:8001/transcribe"
    payload = {"url": video_url}
    
    print(f"\n--- Testing: {description} ---")
    print(f"URL: {video_url}")
    
    start_time = time.time()
    try:
        response = requests.post(api_url, json=payload, timeout=600)
        duration = time.time() - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Time taken: {duration:.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            text = data.get("transcription", "")
            print(f"Transcription length: {len(text)} characters")
            print("Preview:", text[:200] + "...")
        else:
            print("Error:", response.text)
    except Exception as e:
        print(f"Error during request: {e}")

if __name__ == "__main__":
    # 1. Video with subtitles (should be fast)
    test_transcribe("https://www.youtube.com/watch?v=jNQXAC9IVRw", "Video with Subtitles")
    
    # 2. Video without subtitles (should trigger Whisper fallback)
    test_transcribe("https://www.youtube.com/watch?v=7u3-fP1O1O0", "Video without Subtitles (Whisper Fallback)")
