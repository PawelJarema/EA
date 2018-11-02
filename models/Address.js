const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    street: String,
    postal: String,
    phone: String
});

module.exports = addressSchema;