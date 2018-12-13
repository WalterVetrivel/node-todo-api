const request = require('supertest');
const expect = require('expect');
const {
	ObjectID
} = require('mongodb');

const {
	app
} = require('./server');
const {
	Todo
} = require('../models/Todo');
const {
	User
} = require('../models/User');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo'
}]

beforeEach(done => {
	Todo.remove({})
		.then(() => {
			return Todo.insertMany(todos);
		})
		.then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', done => {
		let text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({
				text
			})
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find({
						text: 'Test todo text'
					})
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(err => {
						done(err);
					});
			});
	});

	it('should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find()
					.then(todos => {
						expect(todos.length).toBe(2);
						done();
					})
					.catch(err => {
						done(err);
					});
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done)
	});

	it('should get todo by id', done => {
		request(app)
			.get(`/todos/${todos[0]._id}`)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
			})
			.end(done);
	});

	it('should get 404 if invalid ID is passed', done => {
		request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
	});

	it('should get 404 if non-existent ID is passed', done => {
		request(app)
			.get(`/todos/${new ObjectID()}`)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos', () => {
	it('should delete todo by id', done => {
		request(app)
			.delete(`/todos/${todos[0]._id}`)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.findById(todos[0]._id)
					.then(todo => {
						expect(todo).toNotExist();
						done();
					})
					.catch(err => {
						done(err);
					});
			});
	});

	it('should get 404 if invalid ID is passed', done => {
		request(app)
			.delete(`/todos/123`)
			.expect(404)
			.end(done);
	});

	it('should get 404 if non-existent ID is passed', done => {
		request(app)
			.delete(`/todos/${new ObjectID()}`)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos', () => {
	it('should update todo by id', done => {
		done();
	});

	it('should clear completedAt when todo is not completed', done => {
		done();
	});
});