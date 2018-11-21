const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const rateSchema = new Schema({
	date: Number,
	_user: ObjectId,
	isseller: Boolean,
	isbuyer: Boolean,
	auction: String,
	rate: Number,
	text: String
});

mongoose.model('rate', rateSchema);