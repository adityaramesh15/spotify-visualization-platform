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

        results = self.sp.current_user_top_tracks(time_range='long_term', limit=50)

        # get track ID's and subsequent features
        track_ids = [item['id'] for item in results['items']]
        audio_features = self.sp.audio_features(track_ids)

        # dict keyed by (acousticness, energy), value as mins listened
        acoustic_energy_map = {}
        for item, features in zip(results['items'], audio_features):
            track_duration_ms = item['duration_ms']
            minutes_listened = track_duration_ms / 60000.0

            acousticness = features['acousticness']
            energy = features['energy']

            # add to minutes listened if key is already in map, otherwise default to zero and add new value
            acoustic_energy_map[(acousticness, energy)] = acoustic_energy_map.get((acousticness, energy), 0) + minutes_listened

        return acoustic_energy_map