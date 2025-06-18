from flask import Blueprint
from controllers.group_controller import create_group, get_groups, get_group_details
from controllers.balance_controller import get_group_balances

group_bp = Blueprint('group', __name__)

group_bp.route('/', methods=['POST'])(create_group)
group_bp.route('/', methods=['GET'])(get_groups)
group_bp.route('/<string:group_id>', methods=['GET'])(get_group_details)
group_bp.route('/<string:group_id>/balances', methods=['GET'])(get_group_balances)