const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Telegram bot token - you should move this to an environment variable
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8005182169:AAFoj9A8p8AM7FrAFSojgrZFs65e2DZj8M0';
// Chat ID for message delivery
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1002592836903';

// Function to send message to Telegram
async function sendTelegramMessage(message) {
    try {
        const telegramAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await axios.post(telegramAPI, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        return response.data;
    } catch (error) {
        console.error('Error sending Telegram message:', error.message);
        throw error;
    }
}

module.exports = async (req, res) => {
    // Set CORS headers directly in each handler
    res.setHeader('Access-Control-Allow-Origin', ['https://www.marynastrategy.com', 'https://marynastrategy.com']);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Simple health check for the API root
    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'Telegram Contact API is running',
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    }

    if (req.method === 'POST') {
        try {
            // Get data from request
            const { name, tel, telegram, instagram, message, kind } = req.body;

            // Проверка обязательных полей
            if (!name || !tel) {
                return res.status(400).json({
                    success: false,
                    message: 'Необхідно вказати імʼя та телефон'
                });
            }

            // Формирование сообщения для отправки в Telegram
            let telegramMessage = `<b>Нове повідомлення!</b>\n\n\n`;

            // Add kind/page source if present
            if (kind) {
                telegramMessage += `<b>Source сторінка:</b> ${kind}\n`;
            }

            telegramMessage += `<b>Імʼя:</b> ${name}\n`;

            // Make phone number clickable
            telegramMessage += `<b>Телефон:</b> <a href="tel:${tel}">${tel}</a>\n`;

            // Add optional fields if present with clickable links
            if (telegram) {
                // Remove @ if present and make it clickable
                const telegramUsername = telegram.replace('@', '');
                telegramMessage += `<b>Telegram:</b> <a href="https://t.me/${telegramUsername}">@${telegramUsername}</a>\n`;
            }
            if (instagram) {
                // Remove @ if present and make it clickable
                const instagramUsername = instagram.replace('@', '');
                telegramMessage += `<b>Instagram:</b> <a href="https://instagram.com/${instagramUsername}">@${instagramUsername}</a>\n`;
            }
            if (message) {
                telegramMessage += `<b>Повідомлення:</b> ${message}\n`;
            }

            // Add timestamp
            telegramMessage += `\n<b>Час:</b> ${new Date().toLocaleString('uk-UA')}`;

            // Send message to Telegram
            await sendTelegramMessage(telegramMessage);

            // Response to client
            return res.status(200).json({
                success: true,
                message: 'Повідомлення успішно відправлено в Telegram'
            });
        } catch (error) {
            console.error('Error processing contact form:', error);
            return res.status(500).json({
                success: false,
                message: 'Помилка сервера',
                error: error.message
            });
        }
    }

    // Handle other methods
    return res.status(405).json({ error: 'Method not allowed' });
};