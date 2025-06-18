from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True, allow_headers=["Content-Type"])

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    from routes.user_routes import user_bp
    from routes.group_routes import group_bp
    from routes.expense_routes import expense_bp
    from routes.chatbot_routes import chatbot_bp

    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(group_bp, url_prefix='/group')
    app.register_blueprint(expense_bp, url_prefix='/expense')
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)