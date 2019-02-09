const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema({
	name: String,
	type: String,
	unit: String,
	icon: String,
	values: [String],
	conditional_values: Schema.Types.Mixed
});

const sub_subcategorySchema = new Schema({
    name: String,
    icon: String,
    properties: [propertySchema]
});

const subcategorySchema = new Schema({
    name: String,
    icon: String,
    properties: [propertySchema],
    sub_subcategories: [sub_subcategorySchema],
});

const categorySchema = new Schema({
    name: String,
    icon: String,
    subcategories: [subcategorySchema]
});

mongoose.model('category', categorySchema);
mongoose.model('subcategory', subcategorySchema);
mongoose.model('sub_subcategory', sub_subcategorySchema);
mongoose.model('property', propertySchema);