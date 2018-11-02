const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const bidSchema = new Schema({
    date: number,
    _user: ObjectId,
    price: Number
});

module.exports = bidSchema;
