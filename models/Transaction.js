const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const transactionSchema = new Schema({
    date: Number,
    _balance: ObjectId,
    title: String,
    amount: Number
});

mongoose.model('transaction', transactionSchema);