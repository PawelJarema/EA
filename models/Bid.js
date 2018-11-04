const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const bidSchema = new Schema({
    date: Number,
    _user: ObjectId,
    price: Number
});

module.exports = bidSchema;
