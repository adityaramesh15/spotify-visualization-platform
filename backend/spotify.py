import spotipy
from collections import defaultdict
import pandas as pd
from decimal import Decimal, getcontext
from map import GenreMap
# 10 sub genres to 1 main genre
class Spotify:
    def __init__(self, access_token=None):
        self.sp = spotipy.Spotify(auth=access_token) if access_token else None

    def get_id(self):
        return self.sp.me() if self.sp else None

    def get_acoustic_map(self):
        if not self.sp:
            raise ValueError("Spotify object not authenticated.")
        
        def truncate_float(float_number, decimal_places):
            multiplier = 10 ** decimal_places
            return int(float_number * multiplier) / multiplier

        #user_playlists(user, limit=50, offset=0)
        #user_playlist_tracks(user=None, playlist_id=None, fields=None, limit=100, offset=0, market=None)
        #playlist_tracks(playlist_id, fields=None, limit=100, offset=0, market=None, additional_types=('track',))
        
        results = self.sp.playlist_tracks(playlist_id= self.sp.current_user_playlists(limit=50, offset=0)['items'][0]['id'], limit=100)
        #results = self.sp.current_user_top_tracks(time_range='long_term', limit=50)
        
        
        # get track ID's and subsequent features
        
        
        track_ids = [item['track']['id'] for item in results['items'] if item['track']]
        #track_ids = [item['id'] for item in results['items']]

        acoustic_energy_map = {}

        # read csv with pandas
        df = pd.read_csv('tracks_features.csv')

        # only include rows with track_ids in our top tracks
        df_filtered = df[df['id'].isin(track_ids)]

        for _, row in df_filtered.iterrows():
            
            # get acousticness and energy 
            acousticness = float(row['acousticness']) #if row['acousticness'] else 0.0
            energy = float(row['energy']) #if row['energy'] else 0.0
            minutes_listened = float(row['duration_ms']) / 60000.0
            

            # add to minutes listened if key is already in map, otherwise default to zero and add new value
            acoustic_energy_map[f"{acousticness},{energy}"] = acoustic_energy_map.get(f"{acousticness},{energy}", 0) + minutes_listened
            #(acousticness, energy)
        return acoustic_energy_map
    
        
# if __name__ == '__main__':
#     import os
#     import spotipy
#     from spotipy.oauth2 import SpotifyOAuth

#     # This will handle the OAuth flow
#     sp = Spotify(
#         access_token=None
#     )
    
#     # If the Spotify class relies on self.sp being initialized via OAuth:
#     # Re-initialize self.sp using SpotifyOAuth:
#     sp.sp = spotipy.Spotify(
#         auth_manager=SpotifyOAuth(
#             client_id='95ca60eb49ba46469aa30652ef562422',
#             client_secret='877830392dbf4de38e428a35388ae570',
#             redirect_uri='http://localhost:3000',
#             scope="user-library-read playlist-read-private user-top-read"  # Adjust scopes as needed
#         )
#     )

#     # Now test your function. For example:
#     result = sp.get_acoustic_map()
#     print("Acoustic Energy Map Results:")
#     for k, v in result.items():
#         print(k, v)
        
#     genre_map = GenreMap(matrix_size=128, sigma=5)
#     image = genre_map.generate_map(result)


#     image.save("genre_map_output.png")
        
        
        