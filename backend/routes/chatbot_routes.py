from flask import Blueprint
from controllers.chatbot_controller import gemini_response

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/ask', methods=['POST'])
def ask_endpoint():
    return gemini_response()