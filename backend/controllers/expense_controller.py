from flask import request, jsonify
from database import db
from models import Expense, ExpenseSplit, GroupMember
from decimal import Decimal, ROUND_HALF_UP

def add_expense():
    try:
        data = request.json

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required_fields = ['group_id', 'description', 'amount', 'paid_by', 'split_type']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        amount = Decimal(str(data['amount']))
        group_members = GroupMember.query.filter_by(group_id=data['group_id']).all()
        member_ids = [m.user_id for m in group_members]

        if not group_members:
            return jsonify({'error': 'Group has no members'}), 400

        if data['paid_by'] not in member_ids:
            return jsonify({'error': 'Payer must be a group member'}), 400

        if data['split_type'] == 'percentage':
            if not data.get('splits') or len(data['splits']) != len(group_members):
                return jsonify({'error': 'Invalid percentage splits'}), 400
            if abs(sum(s['percentage'] for s in data['splits']) - 100) > 0.01:
                return jsonify({'error': 'Percentages must sum to 100'}), 400
            for split in data['splits']:
                if split['user_id'] not in member_ids:
                    return jsonify({'error': f"User {split['user_id']} not in group"}), 400

        expense = Expense(
            group_id=data['group_id'],
            description=data['description'],
            amount=amount,
            paid_by=data['paid_by'],
            split_type=data['split_type']
        )
        db.session.add(expense)
        db.session.flush()

        splits = []
        remaining_amount = amount

        if data['split_type'] == 'equal':
            num_members = len(group_members)
            equal_share = (amount / num_members).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

            shares = [equal_share] * (num_members - 1)
            last_share = amount - sum(shares)

            for i, member in enumerate(group_members):
                if member.user_id == data['paid_by']:
                    continue

                share = shares.pop(0) if shares else last_share
                splits.append({
                    'expense_id': expense.id,
                    'user_id': member.user_id,
                    'amount': share,
                    'percentage': None
                })
                remaining_amount -= share

        elif data['split_type'] == 'percentage':
            sorted_splits = sorted(data['splits'], key=lambda x: x['percentage'])

            for i, split_data in enumerate(sorted_splits):
                if split_data['user_id'] == data['paid_by']:
                    continue

                percentage = Decimal(str(split_data['percentage']))
                if i == len(sorted_splits) - 1:
                    split_amount = remaining_amount
                else:
                    split_amount = (amount * percentage / 100).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

                splits.append({
                    'expense_id': expense.id,
                    'user_id': split_data['user_id'],
                    'amount': split_amount,
                    'percentage': float(percentage)
                })
                remaining_amount -= split_amount

        for split_data in splits:
            split = ExpenseSplit(**split_data)
            db.session.add(split)

        db.session.commit()

        return jsonify({
            'message': 'Expense added',
            'expense_id': expense.id,
            'splits': [{
                'user_id': s['user_id'],
                'amount': float(s['amount']),
                'percentage': s.get('percentage')
            } for s in splits]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


def get_all_expenses():
    try:
        expenses = Expense.query.all()
        result = [{
            'id': e.id,
            'description': e.description,
            'amount': float(e.amount),
            'group_id': e.group_id,
            'paid_by': e.paid_by,
            'split_type': e.split_type
        } for e in expenses]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_expense(expense_id):
    try:
        expense = Expense.query.get(expense_id)
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404

        result = {
            'id': expense.id,
            'description': expense.description,
            'amount': float(expense.amount),
            'group_id': expense.group_id,
            'paid_by': expense.paid_by,
            'split_type': expense.split_type
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_expenses_by_group(group_id):
    try:
        expenses = Expense.query.filter_by(group_id=group_id).all()
        result = [{
            'id': e.id,
            'description': e.description,
            'amount': float(e.amount),
            'group_id': e.group_id,
            'paid_by': e.paid_by,
            'split_type': e.split_type
        } for e in expenses]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500