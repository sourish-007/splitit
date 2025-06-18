# SpliIt

A simplified expense tracking application that helps people manage shared expenses and calculate balances within groups. Built with Flask backend, React frontend, and PostgreSQL database.

![Application Screenshot](assets/image.png)

## Live Demo

🚀 **Live Application**: [https://splitit-tpfs.onrender.com](https://splitit-tpfs.onrender.com)

## Features

- **Group Management**: Create groups and add members
- **Expense Tracking**: Add expenses with equal or percentage-based splitting
- **Balance Calculation**: View who owes whom in each group
- **Personal Dashboard**: Track individual balances across all groups
- **AI Chatbot**: Natural language queries about expenses and balances

## Tech Stack

### Backend
- **Python3**
- **Flask** - Web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **TailwindCSS** - Styling
- **Axios** - HTTP client

### AI Integration
- **Google Gemini API** - LLM-powered chatbot

## Setup Instructions

### Prerequisites
- Python 3
- Node.js and npm
- PostgreSQL database

### Backend Setup

1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Run the application
```bash
python app.py
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

## API Documentation

### User Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/user/signup` | Create new user | `{"name": "string", "email": "string"}` |
| POST | `/user/login` | User login | `{"email": "string"}` |
| GET | `/user/` | Get all users | None |
| GET | `/user/{user_id}` | Get user details | None |
| GET | `/user/{user_id}/balances` | Get user balances across all groups | None |

### Group Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/group/` | Create new group | `{"name": "string", "user_ids": [1, 2, 3]}` |
| GET | `/group/` | Get all groups | None |
| GET | `/group/{group_id}` | Get group details | None |
| GET | `/group/{group_id}/balances` | Get group balances | None |

### Expense Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/expense/add` | Add new expense | See expense request format below |
| GET | `/expense/all` | Get all expenses | None |
| GET | `/expense/{expense_id}` | Get expense details | None |
| GET | `/expense/group/{group_id}` | Get expenses by group | None |
| GET | `/expense/split/expense/{expense_id}` | Get splits for expense | None |
| GET | `/expense/split/user/{user_id}` | Get splits for user | None |
| PUT | `/expense/split/{split_id}/payment` | Update split payment status | `{"paid": boolean}` |

### Chatbot Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/chatbot/ask` | Ask AI chatbot | `{"user_id": int, "prompt": "string"}` |

### Expense Request Format

#### Equal Split
```json
{
  "group_id": "ABC12",
  "description": "Dinner at restaurant",
  "amount": 120.00,
  "paid_by": 1,
  "split_type": "equal"
}
```

#### Percentage Split
```json
{
  "group_id": "ABC12",
  "description": "Grocery shopping",
  "amount": 150.00,
  "paid_by": 1,
  "split_type": "percentage",
  "splits": [
    {"user_id": 1, "percentage": 40},
    {"user_id": 2, "percentage": 35},
    {"user_id": 3, "percentage": 25}
  ]
}
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String, Not Null)
- `email` (String, Unique, Not Null)
- `created_at` (DateTime)

### Groups Table
- `id` (Primary Key, String)
- `name` (String, Not Null)
- `created_at` (DateTime)

### Expenses Table
- `id` (Primary Key)
- `group_id` (Foreign Key → Groups)
- `description` (String, Not Null)
- `amount` (Decimal)
- `paid_by` (Foreign Key → Users)
- `split_type` (String: 'equal' or 'percentage')
- `created_at` (DateTime)

### Expense Splits Table
- `id` (Primary Key)
- `expense_id` (Foreign Key → Expenses)
- `user_id` (Foreign Key → Users)
- `amount` (Decimal)
- `percentage` (Decimal, Optional)
- `created_at` (DateTime)

### Group Members Table
- `group_id` (Foreign Key → Groups)
- `user_id` (Foreign Key → Users)
- `joined_at` (DateTime)

## Key Features Implementation

### Split Types
- **Equal Split**: Automatically divides expense equally among all group members
- **Percentage Split**: Allows custom percentage allocation with validation (must sum to 100%)

### Balance Calculation
- Calculates net balance for each user (total paid - total owed)
- Provides group-level and user-level balance views
- Handles complex multi-group scenarios

### AI Chatbot
- Natural language processing for expense queries
- Context-aware responses based on user's expense history
- Supports queries like:
  - "How much do I owe in my Goa Trip group?"
  - "Show me my recent expenses"
  - "Who paid the most in Weekend Trip?"

## Assumptions Made

1. **No Authentication**: Simplified login system without password authentication
2. **No Payment Processing**: Focus on tracking and calculation, not actual payments
3. **Group ID Generation**: Random 5-character alphanumeric group IDs
4. **Decimal Precision**: All monetary values stored with 2 decimal places
5. **Split Validation**: Percentage splits must sum to exactly 100%
6. **Member Restrictions**: Only group members can be assigned expenses or splits