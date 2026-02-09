export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, telegram, subject, message } = req.body;

  // ⚡ Add your Telegram bot token and chat ID here
  const BOT_TOKEN = "7619898657:AAG_yUVJ0HP59aqpwJGnaWBG8Lb0UYPTqpM";
  const CHAT_ID = "8341610251";

  const text = `
New Contact Form Submission:

Name: ${name}
Email: ${email}
Telegram: ${telegram}
Subject: ${subject}
Message: ${message}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    const result = await response.json();

    if (result.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}
