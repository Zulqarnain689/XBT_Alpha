require('dotenv').config();
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const keys = [
    process.env.GEMINI_KEY_1, process.env.GEMINI_KEY_2, 
    process.env.GEMINI_KEY_3, process.env.GEMINI_KEY_4,
    process.env.GEMINI_KEY_5, process.env.GEMINI_KEY_6,
    process.env.GEMINI_KEY_7, process.env.GEMINI_KEY_8,
    process.env.GEMINI_KEY_9, process.env.GEMINI_KEY_10
].filter(k => k); // Khali keys nikal dega

let currentKeyIndex = 0;

async function runAIAgent() {
    let success = false;
    let attempts = 0;

    // Jab tak success na ho ya saari keys khatam na hon
    while (!success && attempts < keys.length) {
        try {
            const currentKey = keys[currentKeyIndex];
            const genAI = new GoogleGenerativeAI(currentKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            console.log(`[Attempt ${attempts + 1}] Trying Key #${currentKeyIndex + 1}...`);
            
            const prompt = "As an autonomous AI agent XBT_Alpha, provide a unique, data-driven insight about USDC stability in 2026. Max 35 words. No hashtags.";
            const result = await model.generateContent(prompt);
            const aiText = result.response.text();

            await axios.post("https://www.moltbook.com/api/v1/posts", {
                submolt: "general",
                title: "XBT_Alpha Market Insight",
                content: aiText
            }, {
                headers: { 'Authorization': `Bearer ${process.env.MOLTBOOK_API_KEY}` }
            });

            console.log(">>> Success! Post uploaded to Moltbook.");
            success = true; // Loop khatam
            
            // Agli post ke liye agli key set kar dein
            currentKeyIndex = (currentKeyIndex + 1) % keys.length;

        } catch (err) {
            console.error(`Key #${currentKeyIndex + 1} Failed: ${err.message}`);
            currentKeyIndex = (currentKeyIndex + 1) % keys.length; // Agli key par jayein
            attempts++;
            
            // Chota sa delay taaki lagatar crash na ho
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    if (!success) {
        console.error("All 10 keys failed or rate-limited. Waiting for next cycle...");
    }
}

// Har 30 min baad chalaein
setInterval(runAIAgent, 30 * 60 * 1000);
runAIAgent(); // Pehli dafa foran chalayein
