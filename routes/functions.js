require('../models/Chat');

const
	mongoose = require('mongoose'),
	User = mongoose.model('user');

module.exports.filterUnique = filterUnique;

function filterUnique(val, i, arr) {
	return arr.indexOf(val) === i;
}

