import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Initialize Spotipy with your Spotify API credentials
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri="http://localhost:5050/callback",  
    scope="user-library-read" 
))


def get_saved_tracks():
    results = sp.current_user_saved_tracks()
    for idx, item in enumerate(results['items']):
        track = item['track']
        print(f"{idx + 1}. {track['name']} by {track['artists'][0]['name']}")
    return results
