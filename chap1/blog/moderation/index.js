const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
	const { type, data } = req.body;
	console.log('GOT EVENT', req.body)
	if (type === 'CommentCreated') {
		const status = data.content.includes('orange') ? 'rejected' : 'approved';
		console.log('CALL MORDERATED');
		await axios.post('http://localhost:3005/events', {
			type: 'CommentModerated',
			data: {
				id: data.id,
				postId: data.postId,
				status,
				content: data.content
			}
		});

		res.send({});
	}
});

app.listen(3003, () => {
	console.log('LISTENING ON 3003');
});
