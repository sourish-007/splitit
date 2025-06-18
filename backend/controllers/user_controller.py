from flask import request, jsonify
from database import db
from models import User

def signup():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        
        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created', 'user_id': user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def login():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return jsonify({'id': user.id, 'name': user.name, 'email': user.email}), 200
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_all_users():
    try:
        users = User.query.all()
        users_list = []
        for user in users:
            users_list.append({
                'id': user.id,
                'name': user.name,
                'email': user.email
            })
        return jsonify({'users': users_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_user_controller():
    return signup()

def get_user_controller(user_id):
    return get_user(user_id)