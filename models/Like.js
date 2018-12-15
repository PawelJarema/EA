const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const likeSchema = new Schema({
    _user: ObjectId,
    _auction: ObjectId
});

mongoose.model('like', likeSchema);
