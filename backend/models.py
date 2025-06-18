from database import db
from datetime import datetime
from sqlalchemy import CheckConstraint

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expenses_paid = db.relationship('Expense', backref='payer')
    expense_splits = db.relationship('ExpenseSplit', backref='user')
    group_memberships = db.relationship('GroupMember', backref='user')
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Group(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.String(5), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    members = db.relationship('GroupMember', backref='group')
    expenses = db.relationship('Expense', backref='group')
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.String(5), db.ForeignKey('groups.id', ondelete='CASCADE'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    paid_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    split_type = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    splits = db.relationship('ExpenseSplit', backref='expense', cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint("split_type IN ('equal', 'percentage')", name='check_split_type'),
    )
    
    def serialize(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'description': self.description,
            'amount': float(self.amount),
            'paid_by': self.paid_by,
            'split_type': self.split_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ExpenseSplit(db.Model):
    __tablename__ = 'expense_splits'
    
    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    percentage = db.Column(db.Numeric(5, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def serialize(self):
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'user_id': self.user_id,
            'amount': float(self.amount),
            'percentage': float(self.percentage) if self.percentage else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class GroupMember(db.Model):
    __tablename__ = 'group_members'
    
    group_id = db.Column(db.String(5), db.ForeignKey('groups.id', ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def serialize(self):
        return {
            'group_id': self.group_id,
            'user_id': self.user_id,
            'joined_at': self.joined_at.isoformat() if self.joined_at else None
        }