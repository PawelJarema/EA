const requireLogin = require('../middleware/requireLogin');
const multer = require('multer');
const upload = multer();

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/Auction');
const Auction = mongoose.model('auction');
require('../models/Category');
const Category = mongoose.model('category');

const Imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');

const Sharp = require('sharp');

module.exports = app => {
    app.get('/auction/get/:id', async (req, res) => {
        const id = req.params.id;

        const auction = await Auction.findOne({ _id: ObjectId(id) });
        res.send(auction);
    });

    app.get('/auction/get_front_page_auctions', async (req, res) => {
        const popular = await Auction.find(
            {}, 
            { title: 1, shortdescription: 1, price: 1, photos: { $slice: 1 } }, 
            { limit: 8, sort: { likes: 1, 'date.start_date': -1 } }
        );
        const newest = await Auction.find(
            {},
            { title: 1, shortdescription: 1, price: 1, photos: { $slice: 1 } },
            { limit: 9, sort: { 'date.start_date': -1 } }
        );

        res.send({ popular, newest });
    });

    app.get('/auction/get_all/:page/:per_page', async (req, res) => {
        const page = parseInt(req.params.page);
        const per_page = parseInt(req.params.per_page) || 10;

        const count = await Auction.countDocuments({});
        const auctions = await Auction.find({}, { title: 1, shortdescription: 1, price: 1, photos:{ $slice: 1 } }, { skip: (page-1) * per_page, limit: per_page}).lean();
        auctions.push(count);

        res.send(auctions);
    });

    app.get('/auction/search/:category/:query/:page/:per_page', async (req, res) => {
        const category = req.params.category === 'Kategorie' ? '.*' : req.params.category;
        const query = req.params.query === '*' ? '.*' : req.params.query;
        const page = parseInt(req.params.page);
        const per_page = parseInt(req.params.per_page);

        const mongo_query = { title: { $regex: query, $options: 'i' }, $or: [{ 'categories.main': { $regex: category, $options: 'i' } }, { 'categories.sub': { $regex: category, $options: 'i'} }] };
        const projection = { title: 1, shortdescription: 1, price: 1, photos:{ $slice: 1 } };
        const options = { skip: (page-1) * per_page, limit: per_page };

        const count = await Auction.countDocuments(mongo_query);
        const auctions = await Auction.find(mongo_query, projection, options).lean();
        auctions.push(count);

        res.send(auctions);
    });

    app.get('/auction/advanced_search/:category/:query/:min/:max/:state/:sort/:page/:per_page', async (req, res) => {
        const page = parseInt(req.params.page);
        const per_page = parseInt(req.params.per_page);

        const category = req.params.category === 'Kategorie' ? '.*' : req.params.category;
        const query = req.params.query === '*' ? '.*' : req.params.query;
        const min = Number(req.params.min) || 1;
        const max = Number(req.params.max) || 999999;

        let state = null;
        switch(req.params.state) {
            case 'nowe':
                state = 'nowy';
                break;
            case 'uzywane':
                state = 'używany';
                break;
            default:
                state = null;
        }

        let sort = null;
        switch(req.params.sort) {
            case 'alfabetycznie':
                sort = [ 'title', 1];
                break;
            case 'tanie':
                sort = [ 'price.start_price', 1 ];
                break;
            case 'drogie':
                sort = [ 'price.start_price', -1];
                break
            default:
                sort = null;
        }

        console.log(category, query, min, max, state, sort);

        const mongo_query = { 
            title: { 
                $regex: query, $options: 'i' 
            }, 
            'price.start_price': { $lte: max, $gte: min },   // change to current_price 
            $or: [
                { 'categories.main': { $regex: category, $options: 'i' } }, 
                { 'categories.sub': { $regex: category, $options: 'i'} }  
            ]
        };

        if (state) {
            mongo_query['attributes'] = { $elemMatch: { name: 'Stan', value: state } };
        }

        const projection = { title: 1, shortdescription: 1, price: 1, photos:{ $slice: 1 } };
        const options = { skip: (page-1) * per_page, limit: per_page };
        
        if (sort) {
            options.sort = { [sort[0]]: sort[1] };
        }

        const count = await Auction.countDocuments(mongo_query);
        const auctions = await Auction.find(mongo_query, projection,options).lean();
        auctions.push(count);

        res.send(auctions);
    });

    app.get('/auction/count/:category', async (req, res) => {
        const category = req.params.category;

        const mains = await Category.find({}).lean();
        const main_names = mains.map(c => c.name);

        const is_main = category === 'Kategorie' || main_names.indexOf(category) !== -1;

        if (is_main) {
            let result = [];
            let items = 0;

            await main_names.map(c => { 
                Auction
                    .count({ 'categories.main': c })
                    .then(count => { 
                        result.push({ name: c, count }) ;
                        items++;
                        if (items === main_names.length) {
                            res.send(result);
                        }
                    }, 
                    (err) => console.log('error'));
            });

            
        } else {
            const parent = mains.filter(c => c.subcategories.filter(sub => sub.name.indexOf(category) !== -1).length)[0];
            const subs = parent.subcategories.map(c => c.name);

            let result = [];
            let items = 0;

            await subs.map(c => { 
                Auction
                    .countDocuments({ 'categories.sub': c })
                    .then(count => { 
                        result.push({ name: c, count }) ;
                        items++;
                        if (items === subs.length) {
                            res.send(result);
                        }
                    }, 
                    (err) => console.log('error'));
            });
        }
    });

    app.get('/auction/get_all', async (req, res) => {        
        const auctions = await Auction.find({}, { title: 1, shortdescription: 1, price: 1, photos: { $slice: 1 } }).limit(10);
        res.send(auctions);
    });
    
    app.post('/auction/create_or_update', [requireLogin, upload.any()], async (req, res) => {
        const data = req.body;
        const attributes = await Object.keys(data).filter(key => key.startsWith('attribute_')).map(key => ({ name: key.replace('attribute_', ''), value: data[key]}));
        
        let auction = null;

        await new Auction({
            _user: ObjectId(req.user._id),
            title: data.title,
            shortdescription: data.shortdescription,
            description: data.description,
            price: {
                start_price: data.start_price,
                min_price: data.min_price,
                buy_now_price: data.buy_now_price,
                current_price: 0,
                hide_min_price: data.hide_min_price === 'on'
            },
            date: {
                start_date: new Date().getTime(),
                duration: data.duration
            },
            likes: 0,
            quantity: data.quantity,
            photos: [],
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
            doc => { req.session.message = 'Pomyślnie dodano aukcję'; auction = doc; },
            (err) => { console.log(err); req.session.error = 'Utworzenie aukcji nie powiodło się';}
        );

        // map image files. resize, return promise buffers
        const promises = await req.files.map(file => ({
            type: file.mimetype,
            data: Sharp(file.buffer).resize(800).toBuffer()
        }));

        let progress = 0;

        await promises.map(promise => {
            const type = promise.type;
            promise.data.then(buffer => {
                Imagemin.buffer(buffer, {
                    plugins: [
                        imageminMozjpeg({ quality: 50 }),
                        imageminPngquant({ quality: 50 }),
                        imageminSvgo(),
                        imageminGifsicle()
                    ]
                }).then(optimisedBuffer => {
                    progress++;

                    auction.photos.push({ type: type, data: optimisedBuffer.toString('base64') });

                    if (progress === req.files.length) {
                        auction.save();
                    }
                });
            });
        });

        res.send({});
  
    });
};