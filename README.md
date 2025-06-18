
# SplitIt - Expense Sharing App

![App Screenshot](https://i.imgur.com/example.png) <!-- Replace with actual screenshot URL -->

## Live Demo
👉 [View Live on Render](https://splitit.onrender.com) <!-- Add your Render URL here -->

## Features
- ✅ Create groups and add members
- ✅ Add expenses with equal/percentage splits
- ✅ View personal and group balances
- ✅ AI-powered expense chatbot
- ✅ User authentication

## 🛠️ Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Flask + PostgreSQL
- **AI**: Gemini API (optional)

## 🚀 Setup for Local Development

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup

# Clone repository
git clone https://github.com/yourusername/SplitIt.git
cd SplitIt/backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/splitwise" > .env
echo "FLASK_APP=app.py" >> .env
echo "FLASK_ENV=development" >> .env
echo "GEMINI_API_KEY=your_key_here" >> .env  # Optional for chatbot

# Initialize database
flask db upgrade

# Run backend
flask run
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

## 🌐 API Endpoints

### User Routes
| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| POST   | `/user/signup`    | Register new user      |
| POST   | `/user/login`     | Login existing user    |

### Group Routes
| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| POST   | `/group/`         | Create new group       |
| GET    | `/group/<group_id>` | Get group details    |

### Expense Routes
| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| POST   | `/expense/add`    | Add new expense        |
| GET    | `/expense/group/<group_id>` | List group expenses |

## 🤖 Chatbot Usage
Send POST requests to `/chatbot/ask` with:
```json
{
  "prompt": "How much do I owe in Group X?",
  "user_id": 123
}
```

## 📝 Assumptions
1. Simplified auth using user IDs
2. All currency values in INR (₹)
3. Database clears on server restart (for demo)
4. Frontend proxies API requests to `http://localhost:5000`

## 🔧 Troubleshooting
- **Database issues**: Verify PostgreSQL is running
- **CORS errors**: Ensure frontend is proxying correctly
- **Chatbot fails**: Remove `GEMINI_API_KEY` to disable

## 📦 Deployment Notes
Configure these environment variables in Render:
- `DATABASE_URL`: Your PostgreSQL connection string
- `FLASK_ENV`: production
- `FRONTEND_URL`: Your frontend domain
```

Key improvements:
1. Removed all Docker references
2. Added Render deployment section
3. Simplified setup instructions
4. Organized API docs in clear tables
5. Added troubleshooting for common Render issues

To use:
1. Copy this entire block
2. Paste into a new `README.md` file
3. Replace:
   - `https://splitit.onrender.com` with your actual Render URL
   - `https://github.com/yourusername/SplitIt.git` with your repo URL
   - Screenshot URL with your actual image
4. Commit and push to GitHub

Would you like me to add any specific deployment notes for Render's PostgreSQL setup?