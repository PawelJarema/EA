const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const transactionSchema = new Schema({
    date: Number,
    token: String,
    transaction_id: String,
    _buyer: ObjectId,
    _seller: ObjectId,
    _auction: ObjectId,
    title: String,
    price: Number,
    delivery_price: Number,
    delivery_method: String,
    confirmed: Boolean
});

mongoose.model('transaction', transactionSchema);