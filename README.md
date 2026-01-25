# AuraFinance 🚀

**AuraFinance** is a premium, AI-driven personal finance application designed to help users track expenses, visualize wealth, and receive intelligent spending insights. Built with a modern tech stack, it features a "Neo-Fintech" aesthetic and a robust full-stack architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## ✨ Key Features
*   **💎 Premium UI**: Glassmorphism design, dark mode, and smooth Framer Motion animations.
*   **🤖 AI Analytics**: Built-in statistical engine to detect spending anomalies and forecast future expenses.
*   **🔐 Secure Vault**: JWT-based authentication, bcrypt password hashing, and secure HTTP-only practices.
*   **📊 Interactive Dashboards**: Real-time financial visualization using Chart.js.
*   **💰 Asset Management**: Track Cash, Digital Gold, and Categories.

## 🛠 Tech Stack
*   **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express, Sequelize (SQLite for portability).
*   **Architecture**: REST API with MVC pattern.

## 🚀 How to Run Locally

### Prerequisites
*   Node.js (v18 or higher)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/nissam-i/AuraFinance.git
cd AuraFinance
```

### 2. Install Dependencies
We have a convenient script to install dependencies for both Client and Server at once:
```bash
npm run install-all
```
*(Or manually: `cd server && npm install`, `cd client && npm install`)*

### 3. Start the Application
Run the full stack (Frontend + Backend) with a single command:
```bash
npm start
```
*   **Frontend**: Opens at `http://localhost:5173`
*   **Backend**: Runs on `http://localhost:5000`

## 🧪 Testing the App
1.  **Register/Login**: Create a new account (Authentication is fully functional).
2.  **Dashboard**: View your initial simulated balance.
3.  **Add Transaction**: Go to "Transactions" -> "Add New" to log an expense.
4.  **Check AI**: Visit "AI Insights" to see how the system interprets your data.

## 📂 Project Structure
```
/AuraFinance
  ├── /client         # React Frontend (Vite)
  ├── /server         # Node.js Backend (Express)
  └── package.json    # Root scripts
```

---
*Built by [Nissam](https://github.com/nissam-i)*
