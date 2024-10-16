const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createWorker } = require('tesseract.js');
const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const data = req.body.data; // Base64 image string
    console.log('Received request at /process-data');

    // Save the base64 image to a temporary file
    const filePath = './temp_image.png';
    base64ToImage(data, filePath);

    // Create a Tesseract worker to process the image
    const worker = await createWorker();
    try {
        // Perform OCR on the saved image
        const ret = await worker.recognize(filePath);
        console.log('Extracted text:', ret.data.text);
        
        await worker.terminate();

        // Clean the extracted text
        var lines = ret.data.text.split('\n');
        lines.splice(0,2);  // Remove the first two lines
        lines.pop();  // Remove last unwanted lines
        lines.pop();
        lines.pop();
        lines.pop();
        lines.pop();
        var newtext = lines.join('\n');
        console.log("Processed text: ", newtext);

        // Send the cleaned-up text to the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": newtext }  // Use the processed text here
            ],
        });

        console.log("ChatGPT completition:", completion);
        const chatgptAnswer = completion .choices[0].message.content;
        console.log("ChatGPT answer:", chatgptAnswer);

        res.json({ message: "Data received and processed!", processedData: chatgptAnswer });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error processing image' });
    } finally {
        // Delete the temporary image file after processing
        fs.unlinkSync(filePath);
    }
});

// Start the server
app.listen(PORT, () => {
    cons