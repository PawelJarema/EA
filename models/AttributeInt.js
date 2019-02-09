const mongoose = require('mongoose');
const { Schema } = mongoose;

const intAttributeSchema = new Schema({
   name: String,
   value: Number
});

module.exports = intAttributeSchema;