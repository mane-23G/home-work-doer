const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createWorker } = require('tesseract.js');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS (for handling requests from your extension)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '50mb' }));

// Helper function to save base64 image as a temporary file
function base64ToImage(base64String, filePath) {
    const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving image:', err);
        }
    });
}

// Route to handle screenshot/text POST requests from your Chrome extension
app.post('/process-data', async (req, res) => {
    const data = req.body.data; 
    console.log('Received request at /process-data');
    console.log("data that is revieved by the caller: " , data);
        // Send the cleaned-up text to the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { "role": "user", "content": data }  // Use the processed text here
            ],
            temperature: 1.0,  // Lower value for more accurate results
            top_p: 1.0  // Ensure top_p matches
        });

        // console.log("ChatGPT completition:", completion);
        const chatgptAnswer = completion.choices[0].message.content;
        console.log("ChatGPT answer:", chatgptAnswer);

        res.json({ message: "Data received and processed!", processedData: chatgptAnswer });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
