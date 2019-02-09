const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const photoSchema = require('./Photo');
const attributeSchema = require('./Attribute');
const intAttributeSchema = require('./AttributeInt');
const bidSchema = require('./Bid');

const auctionSchema = new Schema({
    _user: ObjectId,
    title: String,
    shortdescription: String,
    description: String,
    price: {
        start_price: Number,
        min_price: Number,
        buy_now_price: Number,
        current_price: Number,
        hide_min_price: Boolean
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
        main: String,
        sub: String,
        subsub: String
    },
    bids: [bidSchema],
    verified: Boolean,
    ended: Boolean,
    prepaid: Boolean,
    paid: Boolean,
    payees: [ObjectId],
    buynowpayees: [ObjectId],
    raters: [ObjectId],
    rated: Boolean,
    properties: [attributeSchema],
    int_properties: [intAttributeSchema]
});

mongoose.model('auction', auctionSchema);