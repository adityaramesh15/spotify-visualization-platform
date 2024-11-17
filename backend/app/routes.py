from flask import Blueprint, request, jsonify, send_file
from spotify import Spotify
from map import GenreMap
from database import db, User, Genre
import io

bp = Blueprint('routes', __name__)

@bp.route('/api/save-user', methods=['POST'])
def save_user():
    data = request.json
    access_token = data.get('access_token')

    spotify = Spotify(access_token)
    spotify_user = spotify.get_id()
    spotify_id = spotify_user['id']

    user = User.query.filter_by(spotify_id=spotify_id).first()
    if not user:
        user = User(spotify_id=spotify_id)
        db.session.add(user)
        db.session.commit()

    return jsonify({'message': 'User saved successfully!'})


@bp.route('/api/genre-durations', methods=['POST'])
def get_genre_durations():
    data = request.json
    access_token = data.get('access_token')

    spotify = Spotify(access_token)
    spotify_user = spotify.get_id()
    spotify_id = spotify_user['id']

    user = User.query.filter_by(spotify_id=spotify_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    
    genres = Genre.query.filter_by(user_id=user.id).all()
    if genres:
        genre_dict = {genre.genre_name: genre.duration for genre in genres}
        return jsonify(genre_dict)


    genre_durations = spotify.get_genre_durations()
    for genre_name, duration in genre_durations.items():
        genre = Genre(user_id=user.id, genre_name=genre_name, duration=duration)
        db.session.add(genre)

    db.session.commit()
    return jsonify(genre_durations)


@bp.route('/api/genre-map', methods=['POST'])
def genre_map_route():
    data = request.json
    access_token = data.get('access_token')

    spotify = Spotify(access_token)
    spotify_user = spotify.get_id()
    spotify_id = spotify_user['id']

    user = User.query.filter_by(spotify_id=spotify_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404


    genres = Genre.query.filter_by(user_id=user.id).all()
    if not genres:
        return jsonify({'error': 'No genre data available'}), 404

    genre_dict = {genre.genre_name: genre.duration for genre in genres}


    genre_map = GenreMap(matrix_size=100, sigma=5)
    heatmap_image = genre_map.generate_map(genre_dict)


    img_io = io.BytesIO()
    heatmap_image.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')