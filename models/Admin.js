const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const adminSchema = new Schema({
	login: String,
	password: String,
	provision: Number,
	techbreak: Boolean
});

mongoose.model('admin', adminSchema);