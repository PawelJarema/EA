const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
   url: String,
   data: { type: String, data: Buffer }
});

module.exports = photoSchema;