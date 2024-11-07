#ATTENTION: THIS IS CURRENTLY BROKEN.


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
    if not code:
        return "Error: No code provided.", 400
    try:
        token_info = sp.get_access_token(code)
        session['token_info'] = token_info
    except Exception as e:
        return f"Error retrieving access token: {str(e)}", 400
    return redirect(url_for('routes.login_success'))

@bp.route('/login_success')
def login_success():
    if 'token_info' not in session:
        return redirect(url_for('routes.login'))
    return redirect("http://localhost:3000/graph")

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('routes.login'))