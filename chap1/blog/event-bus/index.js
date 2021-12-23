const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
	const event = req.body;

	events.push(event)
	console.log('GOT EVENT', event);
	axios.post('http://localhost:3000/events', event);
	axios.post('http://localhost:3001/events', event);
	axios.post('http://localhost:3002/events', event);
	axios.post('http://localhost:3003/events', event);

	res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
	res.send(events)
})

app.listen(3005, () => {
	console.log('LISTENING ON  3005');
});
