from flask import Flask
from flask_cors import CORS
from routes import bp
from database import db

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = "supersecretkey"  
    app.register_blueprint(bp)
    db.init_app(app)
    
    return app

if __name__ == '__main__':
    app = create_app()

    with app.app_context():
        db.create_all()

    # app.run(host='localhost', port=5050, debug=True)
    app.run(host='0.0.0.0', port=5050, debug=True)
