# Mental Health Support Chatbot 💙

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blueviolet)

> **⚠️ IMPORTANT MEDICAL DISCLAIMER**
> This chatbot is an automated AI tool for emotional support and resource sharing. **It is NOT a licensed medical professional, nor is it a replacement for therapy.**
>
> **If you or someone you know is in immediate danger:**
> * Call your local emergency services immediately.
> * Contact a suicide prevention hotline (e.g., 988 in the US).
> * Go to the nearest emergency room.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

## 💡 About the Project

This project is a sophisticated mental health support assistant designed to provide empathetic, context-aware responses to users in distress. 

The application utilizes a **multi-service approach** to prioritize user safety:
1.  **Immediate Safety Check:** A Node.js orchestration layer scans every message for high-risk content (self-harm, violence) in real-time.
2.  **Deep Understanding:** Safe messages are forwarded to a Python AI service powered by **DistilRoBERTa** to analyze emotions and generate therapeutic responses from a clinical dataset.

## ✨ Key Features

### 🛡️ Safety-First Crisis Detection
* **Real-time Analysis:** The backend scans every message for trigger keywords *before* processing it for empathy.
* **Emergency Alerting:** If a crisis is detected, the system triggers an SMS/Email alert to a designated emergency contact, including the user's approximate location (captured via browser Geolocation API).

### 🧠 Context-Aware AI (DistilRoBERTa)
* **Emotion Recognition:** Uses a fine-tuned DistilRoBERTa model to classify user text into emotions (e.g., Anxiety, Sadness, Joy, Neutral).
* **Therapeutic Response Matching:** Queries an internal dataset of vetted responses to ensure replies are safe, validating, and helpful.

### 🔒 Secure Data Handling
* **Encrypted Auth:** Uses JWT (JSON Web Tokens) for secure session management.
* **Persistence:** Chat history and user profiles are stored securely in PostgreSQL.

## 🛠 Tech Stack

| Component | Technology | Hosting | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | Netlify | User Interface & Location Capture |
| **Backend 1** | Node.js / Express | Render | Orchestration, Auth, Crisis Logic |
| **Backend 2** | Python 3.8+ | Render | AI/NLP Processing (DistilRoBERTa) |
| **Database** | PostgreSQL | supabase | User Data & Chat Logs |
| **Alerting** | Twilio  | - | SMS & Email Notifications |

## 🚀 Installation & Setup

This project is divided into three main parts: Client, Server (Node), and AI Service (Python).

### Prerequisites
* Node.js (v14+)
* Python (v3.8+)
* PostgreSQL installed locally or a cloud instance URL.

### 1. Clone the Repository

git clone [https://github.com/saidharmendra5/Calmly-Ai-powered-mental-health-support-chat-bot](https://github.com/saidharmendra5/Calmly-Ai-powered-mental-health-support-chat-bot)
cd mental-health-bot
2. Setup Node.js Orchestrator (Backend 1)

cd server-node
npm install
# Start the server
npm run dev
3. Setup Python AI Service (Backend 2)

cd server-python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Start the service
python app.py
4. Setup React Client

cd client
npm install
npm start
🔐 Environment Variables
You must create a .env file in the root of both backend directories.

Node.js Service (/server-node/.env):


PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
JWT_SECRET=your_super_secret_key
PYTHON_SERVICE_URL=http://localhost:8000
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
Python Service (/server-python/.env):


PORT=8000
MODEL_PATH=./models/distilroberta-finetuned
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the Project.

Create your Feature Branch (git checkout -b feature/NewFeature).

Commit your Changes (git commit -m 'Add some NewFeature').

Push to the Branch (git push origin feature/NewFeature).

Open a Pull Request.
