// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    const content = req.body.content;

    if (!content) {
        return res.status(400).json({ error: "Content is required." });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are an assistant that analyzes text and provides political bias ratings." },
                { role: "user", content: `Analyze the political bias of the following text and provide a rating. Focus more on choice of words and other "hidden" factors rather than just the topic of the content. Structure your analysis as such: First, provide a short rating (no more than a couple of words). Then, line break. Then, provide an explanation for your rating\n\n${content}` }
            ],
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const rating = response.data.choices[0].message.content.trim();
        res.json({ rating: rating });
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);

        // Respond with a detailed error message for debugging
        if (error.response) {
            console.error("Error details:", error.response.data);
            res.status(500).json({ error: "Error processing request", details: error.response.data });
        } else {
            res.status(500).json({ error: "Error processing request", details: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
