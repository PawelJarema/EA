const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const messageSchema = new Schema({
    date: Number,
    _photo: ObjectId,
    _from: ObjectId,
    _to: ObjectId,
    text: String,
    seen: Boolean
});

module.exports = messageSchema;