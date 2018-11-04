const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    street: String,
    postal: String,
    city: String
});

module.exports = addressSchema;