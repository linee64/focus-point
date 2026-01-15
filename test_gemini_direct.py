import asyncio
import google.generativeai as genai
import os
from dotenv import load_dotenv

async def test_gemini():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        return

    genai.configure(api_key=api_key)
    
    # Using the models we just found are available
    models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite']
    
    for model_name in models:
        try:
            print(f"Testing model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            response = await model.generate_content_async("Hello, respond with 'READY'")
            print(f"Success with {model_name}: {response.text}")
            return
        except Exception as e:
            print(f"Error with {model_name}: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
