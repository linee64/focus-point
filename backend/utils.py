import re

def clean_text(text: str) -> str:
    """Очистка текста от лишних пробелов, повторов и символов."""
    if not text:
        return ""
    
    # Убираем таймкоды, если они есть [00:00.000 -> 00:00.000]
    text = re.sub(r'\[\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}\.\d{3}\]', '', text)
    
    # Убираем множественные пробелы и переносы строк
    text = re.sub(r'\s+', ' ', text)
    
    # Убираем специфические символы YouTube
    text = text.replace('\xa0', ' ')
    
    return text.strip()

def extract_video_id(url: str) -> str:
    """Извлекает ID видео из URL YouTube."""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:be\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11}).*',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return ""
