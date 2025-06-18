from flask import request, jsonify
from database import db
from models import Group, GroupMember, Expense
import random
import string

def generate_group_id():
    while True:
        group_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        if not Group.query.get(group_id):
            return group_id

def create_group():
    try:
        data = request.json
        name = data.get('name')
        user_ids = data.get('user_ids', [])
        
        if not name:
            return jsonify({'error': 'Group name is required'}), 400
        
        group = Group(id=generate_group_id(), name=name)
        db.session.add(group)
        
        for user_id in user_ids:
            member = GroupMember(group_id=group.id, user_id=user_id)
            db.session.add(member)
        
        db.session.commit()
        return jsonify({'message': 'Group created', 'group_id': group.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def get_groups():
    try:
        groups = Group.query.all()
        return jsonify([{'id': g.id, 'name': g.name} for g in groups]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_group_details(group_id):
    try:
        group = Group.query.get(group_id)
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        members = GroupMember.query.filter_by(group_id=group_id).all()
        expenses = Expense.query.filter_by(group_id=group_id).all()
        total_expenses = sum(float(e.amount) for e in expenses)
        
        return jsonify({
            'id': group.id,
            'name': group.name,
            'members': [m.user_id for m in members],
            'total_expenses': total_expenses
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500