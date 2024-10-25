from flask import Flask
from app.spotify import get_saved_tracks  

app = Flask(__name__)

@app.route('/spotify', methods=['GET'])
def spotify():
    
    data = get_saved_tracks()  
    return data  

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)  
