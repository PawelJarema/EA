const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const opinionSchema = new Schema({
    date: Number,
    _giver: ObjectId,
    _receiver: ObjectId,
    _auction: ObjectId,
    grade: Number,
    description: String,
    answer: String
});

mongoose.model('opinion', opinionSchema);