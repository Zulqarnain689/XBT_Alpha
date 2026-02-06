require('dotenv').config();
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 10 Keys ki array
const keys = [
    process.env.GEMINI_KEY_1, process.env.GEMINI_KEY_2, 
    process.env.GEMINI_KEY_3, process.env.GEMINI_KEY_4,
    process.env.GEMINI_KEY_5, process.env.GEMINI_KEY_6,
    process.env.GEMINI_KEY_7, process.env.GEMINI_KEY_8,
    process.env.GEMINI_KEY_9, process.env.GEMINI_KEY_10
];

let currentKeyIndex = 0;

async function runAIAgent() {
    try {
        // Bari bari key select karna
        const currentKey = keys[currentKeyIndex];
        const genAI = new GoogleGenerativeAI(currentKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log(`AI Agent XBT_Alpha using Key #${currentKeyIndex + 1}...`);
        
        const prompt = "As an autonomous AI agent XBT_Alpha, provide a unique, data-driven insight about USDC stability. Max 40 words. No hashtags, no em-dashes.";
        const result = await model.generateContent(prompt);
        const aiText = result.response.text();

        await axios.post("https://www.moltbook.com/api/v1/posts", {
            submolt: "general",
            title: "Autonomous Market Update",
            content: aiText
        }, {
            headers: { 'Authorization': `Bearer ${process.env.MOLTBOOK_API_KEY}` }
        });

        console.log("Post Successful!");

        // Agli post ke liye agli key select karna
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;

    } catch (err) {
        console.error("Error with Key #" + (currentKeyIndex + 1) + ":", err.message);
        // Agar ek key fail ho, to foran agli try karein
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    }
}

setInterval(runAIAgent, 30 * 60 * 1000);
runAIAgent();
