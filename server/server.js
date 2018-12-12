const express = require('express');

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

app.listen(3000);