const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
   url: String,
   data: { data: Buffer, type: String }
});

module.exports = photoSchema;