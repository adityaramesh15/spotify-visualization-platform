from flask import Flask, request, redirect
from app.spotify import sp  

app = Flask(__name__)

@app.route('/spotify', methods=['GET'])
def spotify():
    data = sp.get_saved_tracks()  
    return data

@app.route('/callback')
def callback():
    token_info = sp.auth_manager.get_access_token(request.args['code'])
    sp.auth_manager.token = token_info['access_token']
    return redirect('/spotify')  

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)

