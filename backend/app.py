from flask import Flask
from app.spotify import get_saved_tracks  

app = Flask(__name__)

@app.route('/spotify', methods=['GET'])
def spotify():
    
    data = get_saved_tracks()  
    return data

#ATTENTION: THIS IS CURRENTLY BROKEN
from app.routes import bp
app.register_blueprint(bp)  
#END OF ATTENTION


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)  
