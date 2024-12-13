from flask import Blueprint, request, jsonify, send_file
from spotify import Spotify
from map import GenreMap
from database import db, UserDB, GenreDB
import io

bp = Blueprint('routes', __name__)

@bp.route('/api/test', methods=['OPTIONS', 'GET'])
def test_route():
    return {"message": "CORS is working!"}, 200

@bp.route('/api/save-user', methods=['POST'])
def save_UserDB():
    data = request.json
    access_token = data.get('access_token')

    spotify = Spotify(access_token)
    spotify_UserDB = spotify.get_id()
    spotify_id = spotify_UserDB['id']

    user = UserDB.query.filter_by(spotify_id=spotify_id).first()
    if not user:
        user = UserDB(spotify_id=spotify_id)
        db.session.add(user)
        db.session.commit()

    return jsonify({'message': 'UserDB saved successfully!'})


@bp.route('/api/genre-durations', methods=['POST'])
def get_raw_acoustic_map():
    data = request.json
    access_token = data.get('access_token')

    spotify = Spotify(access_token)
    spotify_UserDB = spotify.get_id()
    spotify_id = spotify_UserDB['id']

    

    

    user = UserDB.query.filter_by(spotify_id=spotify_id).first()
    if not user:
        return jsonify({'error': 'UserDB not found'}), 404
    
   
    
    
    
    #genres = GenreDB.query.filter_by(user_id=UserDB.id).all()
    
    #if genres:
    #    genre_dict = {
    #        tuple(map(float, genre.coord.split(','))): genre.duration for genre in genres
    #    }
    #    return jsonify(genre_dict)

   
    

    genre_durations = spotify.get_acoustic_map()  
    # for coord, duration in genre_durations.items():
    #     coord_str = f"{coord[0]},{coord[1]}"  
    #     genre = GenreDB(user_id=UserDB.id, coord=coord_str, duration=duration)
    #     db.session.add(genre)

    

    #db.session.commit()
    return jsonify(genre_durations)


@bp.route('/api/genre-map', methods=['POST'])
def genre_map_route():
    data = request.json
    access_token = data.get('access_token')
    genre_durations = data.get('genre_durations')

    # user = UserDB.query.filter_by(spotify_id=spotify_id).first()
    # if not user:
    #     return jsonify({'error': 'UserDB not found'}), 404


    # genres = GenreDB.query.filter_by(UserDB_id=user.id).all()
    # if not genres:
    #     return jsonify({'error': 'No genre data available'}), 404

    
    # genre_dict = {
    #     tuple(map(int, genre.coord.split(','))): genre.duration for genre in genres
    # }

    genre_map = GenreMap(matrix_size=100, sigma=5)
    heatmap_image = genre_map.generate_map(genre_durations)


    img_io = io.BytesIO()
    heatmap_image.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')