from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

class UserDB(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    spotify_id = db.Column(db.String, unique=True, nullable=False)

class GenreDB(db.Model):
    __tablename__ = 'genres'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    coord = db.Column(db.String, nullable=False)
    duration = db.Column(db.Float, nullable=False)
    user = db.relationship('UserDB', backref='genres')