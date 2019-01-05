const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const addressSchema = require('./Address');

const invoiceSchema = new Schema({
	_user: ObjectId,

	doc: {
		docdate: Number,
		docnumber: String,
		selldate: Number,
		place: String
	},
	seller: {
		_id: ObjectId,
		name: String,
		nip: String,
		address: addressSchema,
		account: String
	},
	buyer: {
		_id: ObjectId,
		name: String,
		nip: String,
		address: addressSchema
	},
	items: [{ title: String, qty: Number, unit: String, price: Number, vat: Number}],
	delivery: { title: String, price: Number, vat: Number }
});

mongoose.model('invoice', invoiceSchema);