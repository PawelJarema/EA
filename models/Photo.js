const mongoose = require('moongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
   url: String,
   data: { data: Buffer, contentType: String }
});

module.exports = photoSchema;