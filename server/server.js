const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {
	ObjectID
} = require('mongodb');

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
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	let todo = new Todo({
		text: req.body.text
	});
	todo.save()
		.then(todo => {
			console.log('Todo saved successfully!');
			res.status(200).send({
				todo
			});
		})
		.catch(err => {
			console.log('Unable to save todo.');
			res.status(400).send({
				err
			});
		});
});

app.get('/todos', (req, res) => {
	Todo.find()
		.then(todos => {
			res.status(200).send({
				todos
			});
		})
		.catch(err => {
			res.status(400).send({
				err
			});
		});
});

app.get('/todos/:id', (req, res) => {
	const id = req.params.id;
	if (ObjectID.isValid(id)) {
		Todo.findById(req.params.id)
			.then(todo => {
				if (todo) {
					res.send({
						todo
					});
				} else {
					res.status(404).send({
						error: 'Not found'
					});
				}
			})
			.catch(err => {
				res.send({
					err
				});
			});
	} else {
		res.status(404).send({
			error: 'Invalid ID'
		});
	}
});

app.delete('/todos/:id', (req, res) => {
	const id = req.params.id;
	if (ObjectID.isValid(id)) {
		Todo.findByIdAndDelete(id)
			.then(todo => {
				if (todo) {
					res.send({
						todo
					});
				} else {
					res.status(404).send({
						error: 'Not found'
					});
				}
			})
			.catch(err => {
				res.send(err);
			});
	} else {
		res.status(404).send({
			error: 'Invalid id'
		});
	}
});

app.patch('/todos/:id', (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ['text', 'completed']);

	if (ObjectID.isValid(id)) {
		if (_.isBoolean(body.completed) && body.completed) {
			body.completedAt = new Date().getTime();
		} else {
			body.completed = false;
			body.completedAt = null;
		}
		Todo.findByIdAndUpdate(id, {
				$set: body
			}, {
				new: true
			})
			.then(todo => {
				if (!todo) {
					return res.status(404).send({
						error: 'Todo not found'
					});
				}
				res.status(200).send({
					todo
				});
			})
			.catch(err => {
				res.status(400).send({
					error: 'Cannot update todo'
				});
			});
	} else {
		res.status(404).send({
			error: 'Invalid id'
		});
	}
});

app.listen(port);

module.exports.app = app;