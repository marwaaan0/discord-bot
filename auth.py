from flask import Flask, redirect, url_for, session, request, render_template, jsonify
from functools import wraps
import os
import requests
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import logging
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)
# Configure CORS to allow credentials
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

app.secret_key = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Add this to ensure cookies work across domains
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

db = SQLAlchemy(app)

# Discord OAuth2 credentials
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = 'http://localhost:5000/callback'
DISCORD_API_ENDPOINT = 'https://discord.com/api/v10'

logger.debug(f"Client ID: {DISCORD_CLIENT_ID}")
logger.debug(f"Redirect URI: {DISCORD_REDIRECT_URI}")

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    discord_id = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    avatar = db.Column(db.String(100))

    def to_dict(self):
        return {
            'id': self.discord_id,
            'username': self.username,
            'email': self.email,
            'avatar': self.avatar
        }

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    logger.debug("Accessing index route")
    if 'user_id' in session:
        user = User.query.filter_by(discord_id=session['user_id']).first()
        return render_template('index.html', user=user)
    return render_template('index.html')

@app.route('/login')
def login():
    logger.debug("Accessing login route")
    return redirect(f'https://discord.com/api/oauth2/authorize?client_id={DISCORD_CLIENT_ID}'
                   f'&redirect_uri={DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20email')

@app.route('/callback')
def callback():
    logger.debug("Received callback from Discord")
    code = request.args.get('code')
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI,
        'scope': 'identify email'
    }
    
    # Exchange code for token
    response = requests.post(f'{DISCORD_API_ENDPOINT}/oauth2/token', data=data)
    logger.debug(f"Token exchange response: {response.status_code}")
    token_data = response.json()
    
    # Get user information
    headers = {
        'Authorization': f"Bearer {token_data['access_token']}"
    }
    user_response = requests.get(f'{DISCORD_API_ENDPOINT}/users/@me', headers=headers)
    logger.debug(f"User info response: {user_response.status_code}")
    user_data = user_response.json()
    
    # Create or update user in database
    user = User.query.filter_by(discord_id=user_data['id']).first()
    if not user:
        user = User(
            discord_id=user_data['id'],
            username=user_data['username'],
            email=user_data.get('email'),
            avatar=user_data.get('avatar')
        )
        db.session.add(user)
    else:
        user.username = user_data['username']
        user.email = user_data.get('email')
        user.avatar = user_data.get('avatar')
    
    db.session.commit()
    session['user_id'] = user_data['id']
    
    # Redirect to the main website
    return redirect('http://localhost:3000')

@app.route('/auth/status')
def auth_status():
    logger.debug(f"Auth Status - Session contents: {dict(session)}")
    logger.debug(f"Auth Status - Cookies: {request.cookies}")
    
    is_authenticated = 'user_id' in session
    logger.debug(f"Is authenticated: {is_authenticated}")
    
    user = None
    if is_authenticated:
        user = User.query.filter_by(discord_id=session['user_id']).first()
        if user:
            user = user.to_dict()
            logger.debug(f"Found user: {user}")
        else:
            logger.debug("No user found in database")
    
    response = {
        'authenticated': is_authenticated,
        'user': user,
        'session_id': request.cookies.get('session')
    }
    logger.debug(f"Sending response: {response}")
    
    return jsonify(response)

@app.route('/logout')
def logout():
    logger.debug("Logging out user")
    session.clear()
    return redirect('http://localhost:3000')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
