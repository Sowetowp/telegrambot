require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `webhook/${TOKEN}`;
const WEBHOOK_URL = `${SERVER_URL}/${URI}`;

const app = express();
app.use(express.static("public"))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
app.use(bodyParser.json());

const init = async () => {
    try {
        const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
        console.log(res.data);
    } catch (error) {
        console.error('Error setting webhook:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
    }
};

app.post(`/webhook/${TOKEN}`, async (req, res) => {
    console.log(req.body);

    const chatId = req.body.message.chat.id
    const text = req.body.message.text
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text
    })
    res.send({});
});

app.listen(5000, async () => {
    console.log('App running on port 5000');
    await init();
});
