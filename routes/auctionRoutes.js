const requireLogin = require('../middleware/requireLogin');
const multer = require('multer');
const upload = multer();

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/Auction');
const Auction = mongoose.model('auction');

module.exports = app => {
    app.get('/auction/get_all', async (req, res) => {        
        const auctions = await Auction.find({}, { title: 1, shortdescription: 1, price: 1}).slice('photos', 1).limit(10);
        res.send(auctions);
    });
    
    app.post('/auction/create_or_update', [requireLogin, upload.any()], async (req, res) => {
        const files = await req.files.map(file => ({ data: new Buffer(file.buffer).toString('base64'), type: file.mimetype }));
        const data = req.body;
        const attributes = await Object.keys(data).filter(key => key.startsWith('attribute_')).map(key => ({ name: key.replace('attribute_', ''), value: data[key]}));
        
        const auction = await new Auction({
            _user: ObjectId(req.user._id),
            title: data.title,
            short_description: data.shortdescription,
            description: data.description,
            price: {
                start_price: data.start_price,
                min_price: data.min_price,
                buy_now_price: data.buy_now_price,
                current_price: 0,
                hide_min_price: data.hide_min_price === 'on'
            },
            likes: 0,
            quantity: data.quantity,
            photos: files,
            attributes: attributes,
            categories: {
                main: data.main,
                sub: data.sub
            },
            bids: [],
            verified: false
        })
        .save()
        .then(
            () => { req.session.message = 'Pomyślnie dodano aukcję' },
            (err) => { console.log(err); req.session.error = 'Utworzenie aukcji nie powiodło się';}
        );
        
        res.send({});
    });
};