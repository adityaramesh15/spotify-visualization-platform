from flask import Blueprint, redirect, session, request, url_for
from spotify import sp

bp = Blueprint('routes', __name__)

@bp.route('/login')
def login():
    auth_url = sp.get_authorize_url()
    return redirect(auth_url)

@bp.route('/callback')
def callback():
    code = request.args.get('code')
    token_info = sp.get_access_token(code)
    #This line below stores the api token for future api calls on this user!
    session['token_info'] = token_info
    return redirect(url_for('routes.login_success'))

@bp.route('/login_success')
def login_success():
    return redirect("http://localhost:3000/graph")