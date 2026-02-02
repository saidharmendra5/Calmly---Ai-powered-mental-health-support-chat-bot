const pool = require("../db");
// Note: We removed GoogleGenerativeAI imports since we aren't using them anymore
const fetch = require('node-fetch');

// 1. Import and Setup Twilio
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// =================================================================
// 🐍 PYTHON AI CONFIGURATION
// =================================================================
// Ensure this matches your active Render URL
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
    "suicide", "kill myself", "end it all", "want to die",
    "end my life", "hurt myself", "i want to end this"
];

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

        // --- Auth Check ---
        const chatCheck = await pool.query("SELECT id FROM chats WHERE id = $1 AND user_id = $2", [chatId, userId]);
        if (chatCheck.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        // --- Save User Message ---
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [chatId, 'user', message]);

        // --- Distress Check ---
        const lowerCaseMessage = message.toLowerCase();
        const isDistressed = distressKeywords.some(keyword => lowerCaseMessage.includes(keyword));

        let finalResponse = "";

        if (isDistressed) {
            // EMERGENCY FLOW
            await triggerEmergencySMS(userId, message, latitude, longitude);
            finalResponse = "I am really sorry that you're going through something this painful right now. You don't have to handle this alone. If you're having thoughts about hurting yourself, it could help to reach out to someone who can support you in this moment — a trusted friend, family member, or a mental health professional.";
        } else {
            // NORMAL FLOW: Direct Python Bridge
            const pythonData = await analyzeWithPython(message);
            finalResponse = pythonData.reply;
        }

        // --- Save Assistant Response ---
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [chatId, 'assistant', finalResponse]);
        await pool.query("UPDATE chats SET updated_at = NOW() WHERE id = $1", [chatId]);

        res.json({ reply: finalResponse });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to send message" });
    }
};