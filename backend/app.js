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
    const { industry, doctype, section, context, textToEdit, prompt } = req.body;

    // Curate the prompt based on input data
    const curatedPrompt = `Generate a ${doctype} Document for the ${industry} Industry the section of the doc is ${section}.
    This is what I have already written add onto this :${context}  
    edit this portion: '${textToEdit}' . Here are the specifications ${prompt}
    Do not ask further questions and just generate a document.`;

    let combinedPrompt = 'Generate the following without any text formatting dont make any text bold ' + prompt;

    if (section === 'Deviation Description') {
        combinedPrompt += ` Create the 'Deviation Description' section for a Deviation Investigation Report.
        Provide a clear and concise description of the deviation, including what happened, when it occurred,
        and how it was discovered. Focus on the facts and avoid speculation.`;
    } else if (section === 'Impact Assessment') {
        combinedPrompt += ` Create the 'Impact Assessment' section for a Deviation Investigation Report.
        Evaluate the potential impact of the deviation on product quality, patient safety, and regulatory compliance.
        Include any immediate actions taken to mitigate risks and contain the deviation.`;
    } else if (section === 'Root Cause Analysis') {
        combinedPrompt += ` Create the 'Root Cause Analysis' section for a Deviation Investigation Report.
        Present the findings of the root cause analysis and identify any contributing factors.`;
    } else if (section === 'Corrective Actions') {
        combinedPrompt += ` Create the 'Corrective Actions' section for a Deviation Investigation Report.
        List and describe the corrective actions implemented to address the immediate effects of the deviation
        and prevent its recurrence. Include timelines and responsible parties for each action.`;
    } else if (section === 'Preventive Actions') {
        combinedPrompt += ` Create the 'Preventive Actions' section for a Deviation Investigation Report.
        Outline the long-term preventive measures to be implemented to avoid similar deviations in the future.
        Include any changes to procedures, training, or systems, and explain how these will prevent recurrence.`;
    } else if (section === 'Investigation Procedure') {
        combinedPrompt += ` Create the 'Investigation Procedure' section for a Deviation Investigation Report.
        Describe the step-by-step process followed to investigate the deviation. Include methods used,
        personnel involved, and any specific tools or techniques employed during the investigation.`;
    } else if (section === 'Quality Assurance Review') {
        combinedPrompt += ` Create the 'Quality Assurance Review' section for a Deviation Investigation Report.
        Describe the quality assurance review process for this deviation investigation. Include any
        recommendations or additional actions suggested by the QA team.`;
    } else if (section === 'CAPA Implementation') {
        combinedPrompt += ` Create the 'CAPA Implementation' section for a Deviation Investigation Report.
        Detail the plan for implementing the Corrective and Preventive Actions (CAPA). Include timelines,
        responsible parties, and methods for verifying the effectiveness of the implemented actions.`;
    } else if (section === 'Supporting Documents') {
        combinedPrompt += ` Create the 'Supporting Documents' section for a Deviation Investigation Report.
        List and briefly describe any supporting documents, data, or evidence relevant to the deviation
        investigation. This may include test results, batch records, or other pertinent documentation.`;
    } else if (section === 'Approval and Closure') {
        combinedPrompt += ` Create the 'Approval and Closure' section for a Deviation Investigation Report.
        Outline the process for reviewing and approving the deviation investigation report. Include
        the names and roles of individuals responsible for final approval and report closure.`;
    } else {
        return { text: '' };
    }


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

        const result = await model.generateContent(combinedPrompt, {stream: true});

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
