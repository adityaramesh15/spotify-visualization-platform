import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

class Config:
    SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
    DB_URI = os.getenv("DB_URI")