from flask import request, jsonify
from models import User, Group, Expense, ExpenseSplit, GroupMember
from database import db
import os
import requests
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_user_context(user_id):
    try:
        logger.debug(f"Getting context for user_id: {user_id}")
        user = User.query.get(user_id)
        if not user:
            logger.warning(f"User not found with id: {user_id}")
            return "User not found."
        
        user_groups = db.session.query(Group).join(GroupMember).filter(GroupMember.user_id == user_id).all()
        user_expenses = Expense.query.filter_by(paid_by=user_id).all()
        user_splits = db.session.query(ExpenseSplit).filter_by(user_id=user_id).all()
        
        context = f"User: {user.name} ({user.email})\n"
        context += f"Member of {len(user_groups)} groups: {', '.join([g.name for g in user_groups])}\n"
        context += f"Paid {len(user_expenses)} expenses totaling ${sum([float(e.amount) for e in user_expenses]):.2f}\n"
        context += f"Involved in {len(user_splits)} expense splits totaling ${sum([float(s.amount) for s in user_splits]):.2f}\n"
        
        if user_expenses:
            context += "Recent expenses paid:\n"
            for expense in user_expenses[-5:]:
                context += f"- {expense.description}: ${float(expense.amount):.2f}\n"
        
        if user_splits:
            context += "Recent expense splits:\n"
            for split in user_splits[-5:]:
                expense = Expense.query.get(split.expense_id)
                if expense:
                    context += f"- {expense.description}: owes ${float(split.amount):.2f}\n"
        
        return context
    except Exception as e:
        logger.error(f"Error getting user context: {str(e)}")
        return f"Error retrieving user context: {str(e)}"

def gemini_response():
    try:
        logger.debug("Received chatbot request")
        data = request.get_json()
        logger.debug(f"Request data: {data}")
        
        if not data:
            logger.warning("No data provided in request")
            return jsonify({"error": "No data provided"}), 400

        user_id = data.get("user_id")
        prompt = data.get("prompt")
        
        if not user_id or not prompt:
            logger.warning(f"Missing parameters - user_id: {user_id}, prompt: {prompt}")
            return jsonify({"error": "user_id and prompt are required"}), 400
        
        user_context = get_user_context(user_id)
        logger.debug(f"Generated user context: {user_context}")
        
        enhanced_prompt = f"""You are a helpful expense tracking assistant. Here's the user's expense data:

{user_context}

User Question: {prompt}

Please provide a helpful response about their expenses, groups, or financial insights. Keep responses concise and friendly. Use markdown formatting for better readability."""
        
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            logger.error("GEMINI_API_KEY not found in environment variables")
            return jsonify({"error": "API key not configured"}), 500
            
        payload = {
            "contents": [
                {"parts": [{"text": enhanced_prompt}]}
            ]
        }
        
        logger.debug("Making request to Gemini API")
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        r.raise_for_status()
        
        response_data = r.json()
        logger.debug(f"Gemini API response: {response_data}")
        return jsonify(response_data)
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500