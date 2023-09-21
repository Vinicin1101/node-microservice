const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const Producer = require('./producer');
const producer = new Producer();

app.get('/sendMessage', async (req, res) => {
    const logType = req.body.logType;
    const message = req.body.message;

    if (!message || !Producer.isValidLogType(logType)) {
        res.status(400).json({ message: 'Invalid logType' });
    }

    await producer.newChannel();
    await producer.publishMessage(logType, message);
    res.status(200).json({ message: 'Sended message to exchange'});
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});