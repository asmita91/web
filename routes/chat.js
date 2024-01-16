
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
 
const app = express();
 
// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
const accountSid = 'AC554714b3a847127c36d38912408850f4'; // Your Twilio Account SID
const authToken = 'fae8c28719c6358ba6169a8c293dcbab'; // Your Twilio Auth Token
const client = new twilio(accountSid, authToken);
 
// Simple chatbot logic
function yourChatbotFunction(userMessage) {
    switch (userMessage.toLowerCase()) {
        case 'hello':
            return 'Hi there! How can I help you today?';
        case 'help':
            return 'Sure, I can help you. What do you need assistance with?';
        default:
            return "Sorry, I didn't understand that. Type 'help' for assistance.";
    }
}
 
// Endpoint for Twilio WhatsApp messages
app.post('/message', (req, res) => {
    const incomingMsg = req.body.Body.trim();
    const reply = yourChatbotFunction(incomingMsg);
 
    // Send message via Twilio
    client.messages.create({
        body: reply,
        from: 'whatsapp:+9779807960408', // Your Twilio WhatsApp number
        to: `whatsapp:${req.body.From}`
    }).then(message => {
        console.log(message.sid);
    }).catch(err => console.error(err));
 
    res.send(`
        <Response>
            <Message>${reply}</Message>
        </Response>
    `);
});
 
// Chatbot API endpoint for web application
app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message;
    const botResponse = yourChatbotFunction(userMessage);
    res.json({ reply: botResponse });
});
 
// Server listens on two different ports
const PORT = process.env.PORT || 3000;
const API_PORT = 3001;
 
app.listen(PORT, () => console.log(`Twilio WhatsApp server running on port ${PORT}`));
app.listen(API_PORT, () => console.log(`Chatbot API server running on port ${API_PORT}`));
 