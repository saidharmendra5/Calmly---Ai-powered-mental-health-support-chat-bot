// check_models.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Placeholder
        // There isn't a direct "listModels" helper in the simplified SDK, 
        // but we can try a basic fetch if the SDK fails, or just try the Pro model.

        console.log("Checking model availability...");

        // Try specifically the Flash 001 model
        const flash001 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result1 = await flash001.generateContent("Test");
        console.log("✅ gemini-1.5-flash-001 IS Working!");

    } catch (error) {
        console.log("❌ gemini-1.5-flash-001 Failed:", error.message);

        // Try Gemini Pro as fallback
        try {
            const pro = genAI.getGenerativeModel({ model: "gemini-pro" });
            await pro.generateContent("Test");
            console.log("✅ gemini-pro IS Working! (Use this if Flash fails)");
        } catch (err) {
            console.log("❌ gemini-pro Failed:", err.message);
        }
    }
}

listModels();