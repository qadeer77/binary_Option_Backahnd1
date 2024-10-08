const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.post('/send-notification', (req, res) => {
    const { token, message } = req.body;

    const notificationMessage = {
        notification: {
            title: message.title,
            body: message.body,
        },
        token: token,
    };

    admin.messaging().send(notificationMessage)
        .then((response) => {
            console.log('Successfully sent message:', response);
            res.status(200).send({ success: true, response });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).send({ success: false, error });
        });
});

app.post('/send-notification-multiple', (req, res) => {
    const { tokens, message } = req.body;

    const notificationMessage = {
        notification: {
            title: message.title,
            body: message.body,
        },
        tokens: tokens,
    };

    admin.messaging().sendEachForMulticast(notificationMessage)
        .then((response) => {
            console.log('Successfully sent messages:', response);
            res.status(200).send({ success: true, response });
        })
        .catch((error) => {
            console.error('Error sending messages:', error);
            res.status(500).send({ success: false, error });
        });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
