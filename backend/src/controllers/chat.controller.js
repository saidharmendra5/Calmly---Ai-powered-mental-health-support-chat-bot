const pool = require("../db");

const fetch = require('node-fetch');

// 1. Import and Setup Twilio
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// =================================================================
// 🐍 PYTHON AI CONFIGURATION
// =================================================================

const PYTHON_SERVICE_URL = 'https://calmly-ai-powered-mental-health-support-wc6i.onrender.com/chat';

// --- HELPER: Call Python Service ---
const analyzeWithPython = async (message) => {
    try {
        console.log(`[AI-BRIDGE] Sending to Python: "${message}"`);
        const response = await fetch(PYTHON_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error(`Python Error: ${response.statusText}`);

        const data = await response.json();
        console.log(`[AI-BRIDGE] Python Analysis: Emotion=${data.debug_info?.detected_emotion}`);
        return data; // Returns { reply, debug_info }

    } catch (error) {
        console.error("[AI-BRIDGE] Failed:", error.message);
        // Fallback if Python is completely down
        return {
            reply: "I am having trouble connecting to my thoughts right now. Please try again in a moment.",
            debug_info: { detected_emotion: 'neutral', detected_context: 'error' }
        };
    }
};

// =================================================================
// 🎮 CONTROLLER ACTIONS
// =================================================================

// 1. Get All Chats
exports.getAllChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            "SELECT id, title, created_at FROM chats WHERE user_id = $1 ORDER BY updated_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// 2. Get Single Chat History
exports.getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chatCheck = await pool.query(
            "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
            [chatId, userId]
        );

        if (chatCheck.rows.length === 0) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const messages = await pool.query(
            "SELECT id, role, content, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at ASC",
            [chatId]
        );

        res.json({ id: chatId, messages: messages.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// 3. Start New Chat (UPDATED)
exports.createChat = async (req, res) => {
    const client = await pool.connect();
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const title = message.substring(0, 30) + "...";

        await client.query('BEGIN');

        // A. Create Chat
        const chatResult = await client.query(
            "INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING id",
            [userId, title]
        );
        const chatId = chatResult.rows[0].id;

        // B. Save User Message
        await client.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'user', message]
        );

        // C. Get Response DIRECTLY from Python
        const pythonData = await analyzeWithPython(message);
        const aiResponse = pythonData.reply;

        // D. Save Assistant Response
        await client.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'assistant', aiResponse]
        );

        await client.query('COMMIT');
        res.json({ chatId, reply: aiResponse });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: "Failed to start chat" });
    } finally {
        client.release();
    }
};

// --- Emergency Logic ---
const distressKeywords = [
    "suicide", "murder", "kill myself", "end it all", "i want to die", "die", "dont want to live", "kill", " want to die",
    "end my life", "hurt myself", "i want to end this"
];

// weights for user health score logic
const emotionScoreMap = {
    "joy": 10,
    "surprise": 5,
    "neutral": 0,
    "sadness": -10,
    "anger": -10,
    "fear": -15,
    "disgust": -5
};

const triggerEmergencySMS = async (userId, userMessage, latitude, longitude) => {
    try {
        console.log(`[EMERGENCY LOG] Processing alert for User: ${userId}`);
        const userResult = await pool.query(
            "SELECT full_name, emergency_contact_name, emergency_contact_phone FROM users WHERE id = $1",
            [userId]
        );

        if (userResult.rows.length === 0) return;
        const user = userResult.rows[0];
        if (!user.emergency_contact_phone) return;

        let locationString = "Location unavailable";
        if (latitude && longitude) {
            locationString = `https://www.google.com/maps?q=${latitude},${longitude}`;
        }

        const smsBody = `ALERT: ${user.full_name} is in high distress. Location: ${locationString}. Please check on them.`;

        await client.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.emergency_contact_phone
        });
        console.log(`[SMS SENT] to ${user.emergency_contact_name}`);
    } catch (error) {
        console.error("[SMS FAILED]:", error.message);
    }
};

// 4. Send Message (UPDATED)
exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { message, latitude, longitude } = req.body;
        const userId = req.user.id;
        const EMERGENCY_THRESHOLD = 30; // Trigger SMS below this

        // --- Step A: Get current health score from DB ---
        const userRes = await pool.query("SELECT health_score FROM users WHERE id = $1", [userId]);
        let currentScore = userRes.rows[0]?.health_score ?? 100;

        // --- Step B: Get Emotion from Python Bridge ---
        const pythonData = await analyzeWithPython(message);
        const emotion = pythonData.debug_info?.detected_emotion || "neutral";

        // --- Step C: Update the Score ---
        const impact = emotionScoreMap[emotion] || 0;
        let newScore = Math.max(0, Math.min(100, currentScore + impact));

        // Update the user's score in the database
        await pool.query("UPDATE users SET health_score = $1 WHERE id = $2", [newScore, userId]);

        // --- Step D: Emergency Logic ---
        const lowerCaseMessage = message.toLowerCase();
        const hasDistressKeyword = distressKeywords.some(kw => lowerCaseMessage.includes(kw));
        const isScoreCritical = newScore <= EMERGENCY_THRESHOLD;

        let finalResponse = pythonData.reply;

        if (hasDistressKeyword || isScoreCritical) {
            // Trigger the SMS function you already built
            await triggerEmergencySMS(userId, message, latitude, longitude);

            // If the score is the only thing that triggered it, customize the reply
            if (isScoreCritical && !hasDistressKeyword) {
                finalResponse = "I've noticed things have been quite difficult for you lately. I've reached out to your support contact just to make sure you're okay. I'm right here with you.";
            }
        }

        // --- Step E: Save and Respond ---
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [chatId, 'user', message]);
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [chatId, 'assistant', finalResponse]);

        res.json({
            reply: finalResponse,
            health_score: newScore // Useful for debugging or UI bars
        });

    } catch (err) {
        console.error("Scoring Error:", err.message);
        res.status(500).json({ error: "Failed to process message" });
    }
};