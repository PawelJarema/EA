const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const addressSchema = require('./Address');
const balanceSchema = require('./Balance');

const sendRateSchema = new Schema({
    _auction: ObjectId,
    _user: ObjectId,
    buynow: Boolean,
    count: Number
});

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    birthdate: Number,
    pesel: Number,
    joindate: Number,
    address: addressSchema,
    auth: {
        linkedinId: String,
        facebookId: String,
        googleId: String,
        twitterId: String
    },
    contact: {
        email: String,
        invoice_email: String,
        phone: String
    },
    balance: {
        balance: balanceSchema,
        credits: { type: Number, default: 5 },
        account_number: String
    },
    deliveries: [{ name: String, price: Number }],
    agreements: {
        rodo_1: Boolean,
        rodo_2: Boolean,
        corespondence: Boolean
    },
    security: {
        password: String,
        verified: Boolean,
        id: {
            firstname: String,
            lastname: String,
            id_number: String,
            pesel: String,
            agreement: Boolean
        }
    },
    firm: {
        firm_name: String,
        nip: String
    },
    freebies: {
        auctions: {
            type: Number,
            default: 500
        },
        promos:{
            type: Number,
            default: 5
        }
    },
    toSend: [sendRateSchema],
    toRate: [sendRateSchema]
});

mongoose.model('user', userSchema);