from flask import jsonify
from models.models import db

def get_user_balances():
    result = db.session.execute("SELECT * FROM user_balances")
    balances = [dict(row._mapping) for row in result]
    return jsonify(balances)