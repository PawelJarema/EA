const mongoose = require('mongoose');
require('../models/User');

const User = mongoose.model('user');

module.exports = app => {
    app.get('/api/current_user', async (req, res) => {
        res.send(req.user);
    });
}