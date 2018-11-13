const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const messageSchema = require('./Message');

const chatSchema = new Schema({
	title: String,
    date: Number,
    _user_1: ObjectId,
    _user_2: ObjectId,
    _auction: ObjectId,
    messages: [messageSchema]
});

mongoose.model('chat', chatSchema);