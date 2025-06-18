from flask import Blueprint
from controllers.expense_controller import add_expense, get_expenses_by_group, get_all_expenses, get_expense
from controllers.expense_split_controller import add_split, get_splits_by_expense, get_splits_by_user, update_split_payment

expense_bp = Blueprint('expense', __name__)

expense_bp.route('/add', methods=['POST'])(add_expense)
expense_bp.route('/group/<string:group_id>', methods=['GET'])(get_expenses_by_group)
expense_bp.route('/all', methods=['GET'])(get_all_expenses)
expense_bp.route('/<int:expense_id>', methods=['GET'])(get_expense)

expense_bp.route('/split/add', methods=['POST'])(add_split)
expense_bp.route('/split/expense/<int:expense_id>', methods=['GET'])(get_splits_by_expense)
expense_bp.route('/split/user/<int:user_id>', methods=['GET'])(get_splits_by_user)
expense_bp.route('/split/<int:split_id>/payment', methods=['PUT'])(update_split_payment)