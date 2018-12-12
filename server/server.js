const express = require('express');
const bodyParser = require('body-parser');

const {
	mongoose
} = require('../db/mongoose');
const {
	Todo
} = require('../models/Todo');
const {
	User
} = require('../models/User');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	console.log(req.body);
	let todo = new Todo({
		text: req.body.text
	});
	todo.save()
		.then(todo => {
			console.log('Todo saved successfully!', todo);
			res.status(200).send({
				status: 'Success'
			});
		})
		.catch(err => {
			console.log('Unable to save todo.', err);
			res.status(400).send({
				status: 'Failed'
			});
		});
});

app.listen(3000);