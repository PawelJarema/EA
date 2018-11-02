const mongoose = reqiure('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const messageSchema = require('./Message');

const chatSchema = new Schema({
    date: Number,
    _user_1: ObjectId,
    _user_2: ObjectId,
    _photo_1: ObjectId,
    _photo_2: ObjectId,
    messages: [messageSchema]
});

mongoose.model('chat', chatSchema);