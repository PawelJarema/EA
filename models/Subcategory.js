const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const subcategorySchema = new Schema({
    name: String,
});

module.exports = subcategorySchema;