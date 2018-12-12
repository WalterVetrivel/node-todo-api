const mongoose = require('mongoose');

const User = mongoose.model('User', {
	email: {
		type: String,
		minlength: 5,
		required: true,
		trim: true
	}
});

module.exports.User = User;