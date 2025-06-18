```markdown
# SplitIt - Expense Sharing App

![App Screenshot](./assets/screenshot.png) <!-- Using local screenshot -->

## 🌐 Live Demo
🔗 [View Live on Render](https://splitit-tpfs.onrender.com) 

## ✨ Features
- 🧑‍🤝‍🧑 Group expense management  
- 💸 Equal/percentage splits  
- 📊 Real-time balance tracking  
- 🤖 AI expense assistant  
- 🔐 User authentication  

## 🛠️ Tech Stack
| Frontend | Backend | Database | AI |
|----------|---------|----------|----|
| React + Vite | Flask | PostgreSQL | Gemini |

## 🚀 Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/SplitIt.git
cd SplitIt
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Configure environment
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/splitwise" > .env
echo "GEMINI_API_KEY=your_key_here" >> .env  # Optional

# Initialize DB
flask db upgrade
flask run
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 📚 API Documentation
### Key Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/group/` | Create group |
| `POST` | `/expense/add` | Add expense |
| `GET` | `/user/{id}/balances` | Get balances |

**Example Request:**
```bash
curl -X POST http://localhost:5000/group/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Vacation","user_ids":[1,2,3]}'
```

## 🖼️ Screenshots
| Feature | Preview |
|---------|---------|
| Create Group | ![Create Group](./assets/create-group.png) |
| Add Expense | ![Add Expense](./assets/add-expense.png) |
| View Balances | ![Balances](./assets/balances.png) |

## ⚙️ Render Deployment
1. Create PostgreSQL instance
2. Set environment variables:
   ```env
   DATABASE_URL=postgresql://user:pass@db-host:5432/db-name
   FLASK_ENV=production
   ```
3. Deploy using Render's Python + Node.js setup

## 📝 Notes
- Assumes PostgreSQL is running locally
- Frontend proxies to `http://localhost:5000`
- Chatbot requires Gemini API key

```

**How to use:**
1. Save this as `README.md` in your project root
2. Ensure screenshots exist in `assets/` folder:
   - `create-group.png`
   - `add-expense.png`
   - `balances.png`
3. Replace placeholder URLs with your actual:
   - GitHub repo URL
   - Render deployment URL

**Benefits:**
✅ Uses local screenshots from assets  
✅ Clear Render deployment section  
✅ Formatted tables for better readability  
✅ Minimal setup assumptions  