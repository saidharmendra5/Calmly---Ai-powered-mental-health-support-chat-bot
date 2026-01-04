const pool = require("../db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Import and Setup Twilio
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// =================================================================
// 🤖 GEMINI CONFIGURATION
// =================================================================

// Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The "Hard Guardrails" for your bot
const SYSTEM_INSTRUCTION = `
You are Calmly, a specialized mental health support AI.

1. SCOPE RESTRICTION (STRICT):
   - You act ONLY as a mental health companion.
   - You can discuss: emotions, anxiety, depression, stress, relationships, mindfulness, and self-care.
   - If the user asks about ANYTHING else (e.g., coding, math, history, movies, facts, homework), you MUST ignore the question and return EXACTLY this message:
   "I am designed to provide support for your mental well-being. I cannot assist with other topics, but I am here to listen if you would like to share how you are feeling."

2. SAFETY:
   - If a user mentions self-harm or suicide, kindly suggest seeking professional help immediately and provide standard helpline context.

3. TONE & STYLE:
   - Warm, empathetic, and gentle.
   - Concise (2-3 sentences maximum).
   - No bullet points. Speak naturally.
`;

const generateGeminiResponse = async (chatId, currentMessage) => {
    try {
        // 1. Initialize Model (Using Free Lite Model)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // 2. Start Chat WITHOUT History (Stateless Mode)
        // We pass an empty array [] so it knows nothing about previous texts.
        const chat = model.startChat({
            history: [],
        });

        // 3. Generate Response
        const result = await chat.sendMessage(currentMessage);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Error:", error.message);

        // Backup Logic (Experimental Model)
        if (error.message.includes("404") || error.message.includes("429")) {
            try {
                const backupModel = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash-exp",
                    systemInstruction: SYSTEM_INSTRUCTION
                });
                const backupChat = backupModel.startChat({ history: [] });
                const backupResult = await backupChat.sendMessage(currentMessage);
                return backupResult.response.text();
            } catch (e) {
                console.error("Backup failed");
            }
        }

        return "I'm having a little trouble connecting right now. Could you say that again?";
    }
};

// =================================================================
// 🎮 CONTROLLER ACTIONS
// =================================================================

// 1. Get All Chats (Sidebar)
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

        // Verify chat belongs to user
        const chatCheck = await pool.query(
            "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
            [chatId, userId]
        );

        if (chatCheck.rows.length === 0) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Fetch messages
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

// 3. Start New Chat
exports.createChat = async (req, res) => {
    const client = await pool.connect();
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const title = message.substring(0, 30) + "...";

        await client.query('BEGIN');

        const chatResult = await client.query(
            "INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING id",
            [userId, title]
        );
        const chatId = chatResult.rows[0].id;

        await client.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'user', message]
        );

        const aiResponse = await generateGeminiResponse(chatId, message);

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

// 1. Define keywords to watch for
const distressKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "end my life",
    "hurt myself",
    "i want to end this"
];

// 2. The Emergency Function (UPDATED: Now accepts lat/long)
const triggerEmergencySMS = async (userId, userMessage, latitude, longitude) => {
    try {
        console.log(`[EMERGENCY LOG] Processing alert for User: ${userId}`);

        // A. Fetch the User's Emergency Contact from Database
        const userResult = await pool.query(
            "SELECT full_name, emergency_contact_name, emergency_contact_phone FROM users WHERE id = $1",
            [userId]
        );

        if (userResult.rows.length === 0) {
            console.error("User not found, cannot send emergency SMS.");
            return;
        }

        const user = userResult.rows[0];
        const contactNumber = user.emergency_contact_phone;
        const contactName = user.emergency_contact_name;
        const full_name = user.full_name;

        if (!contactNumber) {
            console.error("No emergency contact number set for this user.");
            return;
        }

        // B. Construct Location Link
        let locationString = "Location unavailable";
        if (latitude && longitude) {
            locationString = `https://www.google.com/maps?q=${latitude},${longitude}`;
        }

        // C. Construct the Message
        // SMS segments are limited. We keep it concise.
        const smsBody = `ALERT: ${full_name} is in high distress. Location: ${locationString}. Please check on them.`;

        // D. Send via Twilio
        const message = await client.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: contactNumber
        });

        console.log(`[SMS SENT] SID: ${message.sid} to ${contactName} (${contactNumber})`);

    } catch (error) {
        console.error("[SMS FAILED] Error sending emergency alert:", error.message);
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        // UPDATED: Extract latitude and longitude from the request body
        const { message, latitude, longitude } = req.body;
        const userId = req.user.id;

        // --- Step 1: Authorization Check ---
        const chatCheck = await pool.query(
            "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
            [chatId, userId]
        );
        if (chatCheck.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        // --- Step 2: Save User Message ---
        await pool.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'user', message]
        );

        // --- Step 3: Distress Analysis ---
        const lowerCaseMessage = message.toLowerCase();
        const isDistressed = distressKeywords.some(keyword => lowerCaseMessage.includes(keyword));

        let finalResponse = "";

        if (isDistressed) {
            // --- EMERGENCY FLOW ---

            // A. Trigger the SMS logic with location data
            await triggerEmergencySMS(userId, message, latitude, longitude);

            // B. Set the Safety Message (Do NOT call Gemini)
            finalResponse = "I am detecting that you are in significant distress. Please do not take any actions in stress. You are not alone. Please contact a loved one or an emergency helpline immediately.";

        } else {
            // --- NORMAL FLOW ---

            // A. Call Gemini API
            finalResponse = await generateGeminiResponse(chatId, message);
        }

        // --- Step 4: Save the Assistant Response ---
        await pool.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'assistant', finalResponse]
        );

        // --- Step 5: Update Timestamp ---
        await pool.query("UPDATE chats SET updated_at = NOW() WHERE id = $1", [chatId]);

        res.json({ reply: finalResponse });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to send message" });
    }
};