import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from collections import defaultdict

# Initialize Spotipy with your Spotify API credentials
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri="http://localhost:5050/callback",  
    scope="user-library-read user-top-read"  
))

def get_genre_durations():
    genre_durations = defaultdict(int)

    results = sp.current_user_top_tracks(time_range='long_term', limit=50)
    for item in results['items']:
        track = item
        track_duration_ms = track['duration_ms']

        
        artist_id = track['artists'][0]['id']
        artist_info = sp.artist(artist_id)
        
        
        for genre in artist_info['genres']:
            genre_durations[genre] += track_duration_ms / 60000  # Convert ms to minutes

    return genre_durations

genre_durations = get_genre_durations()
for genre, minutes in genre_durations.items():
    print(f"{genre}: {minutes:.2f} minutes")
