from flask import request, jsonify
from models.models import db, GroupMember

def add_member():
    data = request.get_json()
    member = GroupMember(**data)
    db.session.add(member)
    db.session.commit()
    return jsonify({"message": "Member added"})

def get_members_by_group(group_id):
    members = GroupMember.query.filter_by(group_id=group_id).all()
    return jsonify([m.serialize() for m in members])