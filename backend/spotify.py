import spotipy
from collections import defaultdict
import pandas as pd
# 10 sub genres to 1 main genre
class Spotify:
    def __init__(self, access_token=None):
        self.sp = spotipy.Spotify(auth=access_token) if access_token else None

    def get_id(self):
        return self.sp.me() if self.sp else None

    def get_acoustic_map(self):
        if not self.sp:
            raise ValueError("Spotify object not authenticated.")

        results = self.sp.current_user_top_tracks(time_range='long_term', limit=50)

        # get track ID's and subsequent features
        track_ids = [item['id'] for item in results['items']]

        acoustic_energy_map = {}

        # read csv with pandas
        df = pd.read_csv('../data/tracks_features.csv')

        # only include rows with track_ids in our top tracks
        df_filtered = df[df['id'].isin(track_ids)]

        for _, row in df_filtered.iterrows():
            
            # get acousticness and energy 
            acousticness = float(row['acousticness']) #if row['acousticness'] else 0.0
            energy = float(row['energy']) #if row['energy'] else 0.0
            minutes_listened = float(row['energy']) / 60000.0
            

            # add to minutes listened if key is already in map, otherwise default to zero and add new value
            acoustic_energy_map[f"{acousticness},{energy}"] = acoustic_energy_map.get((acousticness, energy), 0) + minutes_listened
            #(acousticness, energy)
        return acoustic_energy_map
        

        