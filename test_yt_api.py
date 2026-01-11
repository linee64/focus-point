from youtube_transcript_api import YouTubeTranscriptApi
import sys

video_id = "jNQXAC9IVRw" # Из логов

try:
    print(f"Fetching transcripts for {video_id}...")
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    print("Available transcripts found.")
    
    # Пытаемся найти русский или английский
    try:
        transcript = transcript_list.find_transcript(['ru', 'en'])
    except:
        transcript = transcript_list.find_generated_transcript(['ru', 'en'])
        
    data = transcript.fetch()
    print("Transcript fetched successfully!")
    print("First 100 chars:", " ".join([item['text'] for item in data])[:100])
except Exception as e:
    print(f"Error: {e}")
