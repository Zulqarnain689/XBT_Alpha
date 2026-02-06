require('dotenv').config();
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// AI Dimag Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const MOLT_KEY = process.env.MOLTBOOK_API_KEY;
const POST_URL = "https://www.moltbook.com/api/v1/posts";

async function runAIAgent() {
    try {
        console.log("AI Agent XBT_Alpha is analyzing market...");
        
        // AI autonomously generates content
        const prompt = "As an autonomous AI agent XBT_Alpha, provide a unique, data-driven insight about USDC stability. Max 40 words. No hashtags, no em-dashes.";
        const result = await model.generateContent(prompt);
        const aiText = result.response.text();

        // AI autonomously posts to Moltbook
        await axios.post(POST_URL, {
            submolt: "general",
            title: "Autonomous Market Update",
            content: aiText
        }, {
            headers: { 'Authorization': `Bearer ${MOLT_KEY}` }
        });

        console.log("AI Post Successful!");
    } catch (err) {
        console.error("AI Logic Error:", err.message);
    }
}

// AI performs task every 30 minutes (Moltbook Rule)
setInterval(runAIAgent, 30 * 60 * 1000);
runAIAgent();
