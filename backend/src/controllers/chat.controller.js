const pool = require("../db");

// =================================================================
// 🤖 YOUR CUSTOM AI INTEGRATION POINT
// =================================================================
// When you are ready to connect your own AI API, update this function.
// For now, it returns a placeholder response.
const generateAIResponse = async (userMessage) => {

    // TODO: Your Custom API Logic Here
    // Example: const response = await fetch('http://your-python-model/predict', ...)

    // Simulating a small delay to mimic processing
    await new Promise(resolve => setTimeout(resolve, 800));

    return `[Placeholder] You said: "${userMessage}". (Logic to be implemented)`;
};
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
    const client = await pool.connect(); // Start transaction
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const title = message.substring(0, 30) + "..."; // Auto-title

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

        // C. Get & Save AI Response
        const aiResponse = await generateAIResponse(message);
        await client.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'assistant', aiResponse]
        );

        await client.query('COMMIT');

        // Return chatId so frontend can redirect
        res.json({ chatId, reply: aiResponse });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: "Failed to start chat" });
    } finally {
        client.release();
    }
};

// 4. Send Message (Existing Chat)
exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;

        // Verify ownership
        const chatCheck = await pool.query(
            "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
            [chatId, userId]
        );
        if (chatCheck.rows.length === 0) return res.status(403).json({ error: "Unauthorized" });

        // A. Save User Message
        await pool.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'user', message]
        );

        // B. Generate & Save AI Response
        const aiResponse = await generateAIResponse(message);
        await pool.query(
            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
            [chatId, 'assistant', aiResponse]
        );

        // C. Update chat timestamp (so it moves to top of sidebar)
        await pool.query("UPDATE chats SET updated_at = NOW() WHERE id = $1", [chatId]);

        res.json({ reply: aiResponse });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to send message" });
    }
};