const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/email');
const Subscriber = require('../models/Subscriber'); // You need to create this model

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Save email to database
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already subscribed' });

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send welcome/confirmation email
    const htmlContent = `<h1>Welcome to Gamify Newsletter!</h1><p>Thanks for subscribing.</p>`;
    await sendEmail(email, 'Subscription Confirmed', htmlContent);

    res.status(200).json({ message: 'Subscription successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
