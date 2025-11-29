# 1️⃣ เข้าโฟลเดอร์โปรเจค
cd ~/Documents/Thai-food-search  # <-- แก้ path ให้ตรงกับโฟลเดอร์ของคุณ

# 2️⃣ สร้าง README.md
cat > README.md <<EOL
# 🍜 Thai Food Search

A simple web application to search Thai food recipes with ingredients, cooking steps, difficulty, and time.  

Built with **Next.js (React)**, **Express.js**, and **Elasticsearch**.

---

## 🛠️ Requirements

- Node.js (v18+ recommended)
- Elasticsearch (v8+)
- npm or yarn

---

## 📂 Project Structure

\`\`\`
thai-food-search/
│
├─ frontend/         # Next.js React frontend
│  └─ page.tsx
├─ backend/          # Express.js server
│  └─ server.js
├─ scripts/          # Elasticsearch import script
│  └─ import_data.js
├─ thai_foods.json   # Recipe data
└─ README.md
\`\`\`

---

## 🚀 Setup & Run

### 1️⃣ Start Elasticsearch
Make sure Elasticsearch is running at http://localhost:9200.

### 2️⃣ Import Data into Elasticsearch
\`\`\`bash
cd scripts
node import_data.js
\`\`\`

### 3️⃣ Start Backend Server
\`\`\`bash
cd backend
node server.js
\`\`\`

Server will run at: http://localhost:5001

### 4️⃣ Start Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Frontend will run at: http://localhost:3000

---

## 🔍 How to Use

1. Open http://localhost:3000 in your browser.
2. Type a search query, e.g. "spicy", "15 min", "easy".
3. Click on a recipe card to see full details and steps.
4. Use the sort button to sort by relevance ascending/descending.

---
