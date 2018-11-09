const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const addressSchema = require('./Address');
const balanceSchema = require('./Balance');

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    birthdate: Number,
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
        current_credits: Number,
        account_number: String
    },
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
    company: {
        name: String,
        nip: String,
        regon: String,
        address: addressSchema
    }
});

mongoose.model('user', userSchema);