const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
const port = 5000;
api_key = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to handle the frontend request
app.post('/api/gemini', async (req, res) => {
    const { industry, doctype, title, context, textToEdit, prompt } = req.body;

    // Curate the prompt based on input data
    const curatedPrompt = `DO NOT FORMAT THE TEXT...
    Generate a ${doctype} Document for the ${industry} Industry the title of the doc is ${title}.
    This is what I have already written add onto this :${context}  
    edit this portion: '${textToEdit}' . Here are the specifications ${prompt}
    Do not ask further questions and just generate a document.`;

    try {


        const genAI = new GoogleGenerativeAI(api_key);
        const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        tools: [
            {
            codeExecution: {},
            },
        ],
        });

        const result = await model.generateContent(curatedPrompt);

        const response = result.response;
        console.log(response.text());

        // Send the Gemini response back to the frontend

        res.json({ response: response.text() });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
