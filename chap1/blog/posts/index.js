const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};
app.get('/posts', (req, res) => {
	res.send(posts);
});
app.post('/posts', async (req, res) => {
	const id = randomBytes(4).toString('hex');

	const {title} = req.body;

	posts[id] = {
		id,
		title
	};

	await axios.post('http://localhost:3005/events', {
		type: 'PostCreated',
		data: {
			id,
			title
		}
	});

	res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
	console.log('receive event', req.body.type);

	res.send({});
});

app.listen(3000, () => {
	console.log('Listening on 3000');
});
