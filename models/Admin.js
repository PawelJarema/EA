const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const adminSchema = new Schema({
	login: String,
	password: String,
	provision: Number,
	premium7daysPrice: { type: Number, default: 6 },
	premiumForeverPrice: { type: Number, default: 12 },
	techbreak: Boolean
});

mongoose.model('admin', adminSchema);