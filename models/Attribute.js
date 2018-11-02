const mongoose = require('mongoose');
const { Schema } = mongoose;

const attributeSchema = new Schema({
   name: String,
   value: String
});

module.exports = attributeSchema;