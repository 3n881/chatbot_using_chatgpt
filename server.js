const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');  // Import OpenAI client
require('dotenv').config();  // To load environment variables securely
const path = require('path');


const app = express();
app.use(bodyParser.json());  // To parse incoming JSON requests

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


// Create a new OpenAI client instance with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // API key from .env file
});

const cors = require('cors');
app.use(cors());


// const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Read from .env
// const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

// POST endpoint to handle chat messages
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;  // Get the user's message from the request body

  try {
    // Send request to OpenAI API using the new client instance
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Use GPT-3.5 or other models
      messages: [{ role: 'user', content: userMessage }],
    });

    // Send back the AI's response to the frontend
    res.json({ reply: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error communicating with OpenAI: ", error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

// Serve the index.html file when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 10000;  // Use the environment variable PORT if available, otherwise fallback to 10000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
