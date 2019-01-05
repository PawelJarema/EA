const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const rateSchema = new Schema({
	date: Number,
	_user: ObjectId,
	_rater: ObjectId,
	isseller: Boolean,
	isbuyer: Boolean,
	auction: String,
	rate: Number,
	text: String
});

mongoose.model('rate', rateSchema);