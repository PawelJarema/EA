const mongoose = require('mongoose');
require('../models/Category');

const Category = mongoose.model('category');

module.exports = app => {
    app.get('/api/categories', async (req, res) => {
        const categories = await Category.find({}, (err, categories) => {
            if (err) {
                console.log(err);
            } else {
                res.send(categories);
            }
        });
    });
}