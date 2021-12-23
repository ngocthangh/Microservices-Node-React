const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	} else if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		post.comments.push({ id, content, status });
	} else if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;
		const post = posts[postId];

		const comment = post.comments.find(item => item.id === id);

		comment.status = status;
		comment.content = content;
	}
}

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	handleEvent(type, data)

	console.log(posts);
	res.send({});
});

app.listen(3002, async () => {
	console.log('LISTENING ON 3002');

	const res = await axios.get('http://localhost:3005/events');

	for (let event of res.data) {
		console.log('Handling event ', event.type)

		handleEvent(event.type, event.data)
	}
});
