from flask import request, jsonify
from database import db
from models import ExpenseSplit

def add_split():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['expense_id', 'user_id', 'amount']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        split = ExpenseSplit(
            expense_id=data.get('expense_id'),
            user_id=data.get('user_id'),
            amount=data.get('amount'),
            paid=data.get('paid', False),
            percentage=data.get('percentage')
        )
        
        db.session.add(split)
        db.session.commit()
        
        return jsonify({'message': 'Split added', 'split_id': split.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def get_splits_by_expense(expense_id):
    try:
        splits = ExpenseSplit.query.filter_by(expense_id=expense_id).all()
        
        splits_list = []
        for s in splits:
            split_data = {
                'id': s.id,
                'expense_id': s.expense_id,
                'user_id': s.user_id,
                'amount': float(s.amount),
                'paid': s.paid if hasattr(s, 'paid') else False
            }
            
            if hasattr(s, 'percentage') and s.percentage:
                split_data['percentage'] = float(s.percentage)
            
            if hasattr(s, 'serialize'):
                split_data = s.serialize()
            
            splits_list.append(split_data)
        
        return jsonify({'splits': splits_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_splits_by_user(user_id):
    try:
        splits = ExpenseSplit.query.filter_by(user_id=user_id).all()
        
        splits_list = []
        for s in splits:
            split_data = {
                'id': s.id,
                'expense_id': s.expense_id,
                'user_id': s.user_id,
                'amount': float(s.amount),
                'paid': s.paid if hasattr(s, 'paid') else False
            }
            
            if hasattr(s, 'percentage') and s.percentage:
                split_data['percentage'] = float(s.percentage)
            
            if hasattr(s, 'serialize'):
                split_data = s.serialize()
            
            splits_list.append(split_data)
        
        return jsonify({'splits': splits_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def update_split_payment(split_id):
    try:
        data = request.get_json()
        split = ExpenseSplit.query.get(split_id)
        
        if not split:
            return jsonify({'error': 'Split not found'}), 404
        
        if 'paid' in data:
            split.paid = data['paid']
        
        db.session.commit()
        return jsonify({'message': 'Split updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500