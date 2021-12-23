const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id]) || [];
});

app.post('/posts/:id/comments', async (req, res) => {
	const id = randomBytes(4).toString('hex');

	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	comments.push({ id, content, status: 'pending' });

	commentsByPostId[req.params.id] = comments;

	await axios.post('http://localhost:3005/events', {
		type: 'CommentCreated',
		data: {
			id,
			content,
			postId: req.params.id,
			status: 'pending'
		}
	});

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
	console.log('receive event', req.body.type);

	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		console.log('GOT MORDERATED...');
		const { postId, status, id, content } = data;

		const comments = commentsByPostId[postId];
		const comment = comments.find(item => item.id === id);

		comment.status = status;

		await axios.post('http://localhost:3005/events', {
			type: 'CommentUpdated',
			data: {
				id,
				content,
				postId,
				status
			}
		});
	}

	res.send({});
});

app.listen(3001, () => {
	console.log('Listening on 3001');
});
