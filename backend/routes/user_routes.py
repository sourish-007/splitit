from flask import Blueprint
from controllers.user_controller import signup, login, get_user, get_all_users
from controllers.balance_controller import get_user_balances

user_bp = Blueprint('user', __name__)

user_bp.route('/signup', methods=['POST'])(signup)
user_bp.route('/login', methods=['POST'])(login)
user_bp.route('/', methods=['GET'])(get_all_users)
user_bp.route('/<int:user_id>', methods=['GET'])(get_user)
user_bp.route('/<int:user_id>/balances', methods=['GET'])(get_user_balances)