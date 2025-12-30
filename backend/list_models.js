// backend/list_models.js
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    try {
        console.log("🔍 Connecting to Google API...");
        const response = await fetch(URL);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        if (!data.models) {
            console.log("⚠️ No models found. Check your API key permissions.");
            return;
        }

        console.log("\n✅ AVAILABLE MODELS (Copy one of these names):");
        console.log("------------------------------------------------");

        // Filter for models that support "generateContent"
        const chatModels = data.models.filter(m =>
            m.supportedGenerationMethods.includes("generateContent")
        );

        chatModels.forEach(model => {
            // Clean up the name (remove "models/" prefix)
            const name = model.name.replace("models/", "");
            console.log(`🌟 ${name}`);
        });

        console.log("------------------------------------------------");

    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

listModels();