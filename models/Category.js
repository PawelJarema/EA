const mongoose = require('mongoose');
const { Schema } = mongoose;

const subcategorySchema = require('./Subcategory');

const categorySchema = new Schema({
    name: String,
    subcategories: [subcategorySchema]
});

mongoose.model('category', categorySchema);