const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const photoSchema = require('./Photo');
const attributeSchema = require('./Attribute');
const bidSchema = require('./Bid');

const auctionSchema = new Schema({
    title: String,
    description: String,
    price: {
        start_price: Number,
        min_price: Number,
        buy_now_price: Number,
        current_price: Number
    },
    date: {
        start_date: Number,
        duration: Number
    },
    likes: Number,
    quantity: Number,
    photos: [photoSchema],
    attributes: [attributeSchema],
    categories: {
        _main: ObjectId,
        _sub: ObjectId
    },
    bids: [bidSchema],
    verified: Boolean
});

mongoose.model('auction', auctionSchema);