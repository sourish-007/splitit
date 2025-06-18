from flask import jsonify
from database import db
from sqlalchemy import text

def get_user_balances(user_id):
    try:
        query = """
        WITH user_payments AS (
            SELECT 
                paid_by as user_id,
                SUM(amount) as total_paid
            FROM expenses
            WHERE paid_by = :user_id
            GROUP BY paid_by
        ),
        user_debts AS (
            SELECT 
                es.user_id,
                SUM(es.amount) as total_owed
            FROM expense_splits es
            WHERE es.user_id = :user_id
            GROUP BY es.user_id
        )
        SELECT 
            u.id,
            u.name,
            COALESCE(up.total_paid, 0) as total_paid,
            COALESCE(ud.total_owed, 0) as total_owed,
            COALESCE(up.total_paid, 0) - COALESCE(ud.total_owed, 0) as net_balance
        FROM users u
        LEFT JOIN user_payments up ON u.id = up.user_id
        LEFT JOIN user_debts ud ON u.id = ud.user_id
        WHERE u.id = :user_id
        """
        
        result = db.session.execute(text(query), {'user_id': user_id})
        balance = result.fetchone()
        
        if balance:
            return jsonify(dict(balance._mapping)), 200
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_group_balances(group_id):
    try:
        query = """
        WITH group_expenses AS (
            SELECT 
                e.id,
                e.description,
                e.amount,
                e.paid_by,
                u.name as payer_name
            FROM expenses e
            JOIN users u ON e.paid_by = u.id
            WHERE e.group_id = :group_id
        ),
        group_splits AS (
            SELECT 
                es.expense_id,
                es.user_id,
                es.amount,
                u.name as user_name
            FROM expense_splits es
            JOIN users u ON es.user_id = u.id
            JOIN expenses e ON es.expense_id = e.id
            WHERE e.group_id = :group_id
        ),
        user_payments AS (
            SELECT 
                paid_by as user_id,
                SUM(amount) as total_paid
            FROM expenses
            WHERE group_id = :group_id
            GROUP BY paid_by
        ),
        user_debts AS (
            SELECT 
                es.user_id,
                SUM(es.amount) as total_owed
            FROM expense_splits es
            JOIN expenses e ON es.expense_id = e.id
            WHERE e.group_id = :group_id
            GROUP BY es.user_id
        )
        SELECT 
            u.id,
            u.name,
            COALESCE(up.total_paid, 0) as total_paid,
            COALESCE(ud.total_owed, 0) as total_owed,
            COALESCE(up.total_paid, 0) - COALESCE(ud.total_owed, 0) as net_balance
        FROM users u
        JOIN group_members gm ON u.id = gm.user_id
        LEFT JOIN user_payments up ON u.id = up.user_id
        LEFT JOIN user_debts ud ON u.id = ud.user_id
        WHERE gm.group_id = :group_id
        ORDER BY net_balance DESC
        """
        
        result = db.session.execute(text(query), {'group_id': group_id})
        balances = [dict(row._mapping) for row in result]
        return jsonify(balances), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500