// routes/twilio.js
import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

console.log('Account SID:', accountSid);
console.log('Auth Token:', authToken);
console.log('Twilio Phone Number:', twilioPhoneNumber);

router.post('/make-call', (req, res) => {
    const { to } = req.body;
    console.log('Number to Call:', to);

    if (!to) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: to,
        from: twilioPhoneNumber,  // Using the env variable here
    })
    .then(call => {
        console.log('Call initiated:', call.sid);
        res.status(200).json({ message: 'Call initiated', callSid: call.sid });
    })
    .catch(error => {
        console.error('Error making call:', error);
        res.status(500).json({ message: 'Error making call', error: error.message });
    });
});

export default router;
