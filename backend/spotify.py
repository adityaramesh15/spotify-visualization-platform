import spotipy
from collections import defaultdict

# 10 sub genres to 1 main genre
class Spotify:
    def __init__(self, access_token=None):
        self.sp = spotipy.Spotify(auth=access_token) if access_token else None

    def get_id(self):
        return self.sp.me() if self.sp else None

    def get_genre_durations(self):
        if not self.sp:
            raise ValueError("Spotify object not authenticated.")
        
        genre_durations = defaultdict(int)
        results = self.sp.current_user_top_tracks(time_range='long_term', limit=50)
        for item in results['items']:
            track = item
            track_duration_ms = track['duration_ms']
            artist_id = track['artists'][0]['id']
            artist_info = self.sp.artist(artist_id)

            for genre in artist_info['genres']:
                genre_durations[genre] += track_duration_ms / 60000

        return genre_durations