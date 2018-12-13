const requireLogin = require('../middleware/requireLogin');
const multer = require('multer');
const upload = multer();

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/User');
require('../models/Auction');
require('../models/Category');
require('../models/Rate');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const Category = mongoose.model('category');
const Rate = mongoose.model('rate');

const Imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');

const Sharp = require('sharp');

const buyNowWonTemplate = require('../services/emailTemplates/buyNowWonTemplate');
const buyNowItemSoldTemplate = require('../services/emailTemplates/buyNowItemSoldTemplate');
const Mailer = require('../services/Mailer');

const currentUserId = (req) => {
    if (req.user) {
        return ObjectId(req.user._id);
    } else {
        return null;
    }
}

async function addBidders(auction) {
    let auction_object = auction.toObject(),
        bidders_object = {};
    const bidder_ids = auction.bids.map(bid => ObjectId(bid._user));
    const bidders = await User.find({ _id: { $in: bidder_ids }}, { firstname: 1, lastname: 1 }).lean();
    bidders.map(bidder => (bidders_object[bidder._id] = bidder ));
    auction_object.bidders = bidders_object;
    return auction_object;
}

async function buyNowNotifications(user, owner, auction) {
    let subject, recipients, mailer;
    let res;

    const price = auction.price.buy_now_price;
    const username = `${user.firstname || ''} ${user.lastname || !user.firstname ? 'Anonim' : ''}`;
    
    subject = 'Kupiłeś przedmiot ' + auction.title;
    recipients = [{ email: user.contact.email }];
    mailer = new Mailer({ subject, recipients }, buyNowWonTemplate(auction._id, auction.title, price));
    res = await mailer.send();

    subject = `${username} kupi od Ciebie ${auction.title} w opcji Kup Teraz`;
    recipients = [{ email: owner.contact.email }];
    mailer = new Mailer({ subject, recipients }, buyNowItemSoldTemplate(auction._id, auction.title, username, price));
    res = await mailer.send();
}

// TODO
module.exports = app => {
    app.post('/auction/rate', requireLogin, async (req, res) => {
        const rate = req.body;

        const auction = await Auction.findOne({ _id: ObjectId(rate._auction)});
        auction.rated = true;
        auction.raters = auction.raters.filter(id => String(id) !== String(req.user._id));

        rate._user = ObjectId(rate._user);
        rate._rater = ObjectId(req.user._id);

        delete rate._auction;
        const newRate = new Rate(rate).save().then(
            doc => { 
                auction.save().then(
                    doc => {
                        req.session.message = 'Pomyślnie dodano opinię';
                        res.send({});
                    },
                    err => { 
                        console.log(err);
                        req.session.error = 'Błąd przy zapisie stanu aukcji. Spróbuj później';
                        res.send({});
                    }
                );
            },
            err => {
                console.log(err);
                req.session.error = 'Nastąpił nieoczekiwany błąd. Spróbuj później';
                res.send({});
            }
        );
    });


    app.post('/auction/delete/:id', requireLogin, async (req, res) => {
        const id = req.params.id;

        const auction = await Auction.findOne({ _id: ObjectId(id) });
        await auction.remove().then(
            () => { req.session.message = 'Skasowano aukcję'; res.send({}); },
            err => { console.log(err); req.session.error = 'Nastąpił błąd'; res.send({}); }
        ); 
    });

    app.post('/auction/my_bids/:page/:per_page', requireLogin, async (req, res) => {
        const { page, per_page } = req.params;
        const mode = req.body.mode;

        const query = { bids: { $elemMatch: { _user: ObjectId(req.user._id) }}, ended: (mode === 'ended' ? true : ({ $ne: true })) };
        const projection = { _user: 1, title: 1, shortdescription: 1, price: 1, bids: 1, date: 1, photos: { $slice: 1 }, ended: 1, rated: 1, payees: 1, buynowpayees: 1, raters: 1 };
        const options = { skip: (+page - 1) * +per_page, limit: +per_page, sort: { 'date.start_date': 1 }};

        const auctions = await Auction.find(
            query, 
            projection, 
            options
        ).lean();

        const count = await Auction.countDocuments(query);
        auctions.push(count);

        if (count === 0) {
            res.send(false);
        } else {
            res.send(auctions);
        }
    });

    app.post('/auction/my_auctions/:page/:per_page', requireLogin, async (req, res) => {
        const { page, per_page } = req.params;
        const mode = req.body.mode;

        const query = { _user: req.user._id, ended: (mode === 'ended' ? true : ({ $ne: true })) };
        const projection = { title: 1, shortdescription: 1, price: 1, bids: 1, date: 1, photos: { $slice: 1 }, ended: 1 };
        const options = { skip: (+page - 1) * +per_page, limit: +per_page, sort: { 'date.start_date': 1 }};
        
        const auctions = await Auction.find(
            query, 
            projection, 
            options
        ).lean();

        const count = await Auction.countDocuments(query);
        auctions.push(count);

        if (count === 0) {
            res.send(false);
        } else {
            res.send(auctions);
        }
    });

    app.post('/auction/buy_now/:id', requireLogin, async (req, res) => {
        const user = req.user;
        const auction_id = req.params.id;

        const auction = await Auction.findOne({ _id: ObjectId(auction_id) });
        const owner = await User.findOne({ _id: ObjectId(auction._user) });

        auction.quantity = auction.quantity - 1;
        if (auction.buynowpayees) {
            auction.buynowpayees.push(ObjectId(user._id));
        } else {
            auction.buynowpayees = [ObjectId(user._id)];
        }

        if (auction.quantity === 0) {
            auction.ended = true;
        }

        await auction.save().then(
            async doc => {
                req.session.message = 'Kupiłeś ' + auction.title;
                res.send(await addBidders(doc));

                await buyNowNotifications(user, owner, doc);
            },
            async err => {
                console.log(err);
                req.session.error = 'Nastąpił błąd. Spróbuj ponownie';
                res.send(await addBidderd(auction));
            }
        );
    });

    app.post('/auction/bid/:id', [requireLogin, upload.any()], async (req, res) => {
        const price = req.body.bid;
        const auction_id = req.params.id;
        const date = new Date().getTime();

        const auction = await Auction.findOne({ _id: ObjectId(auction_id) });
        const bids = auction.bids;
        if (bids.length) {
            let existingBid = bids.filter(bid => String(bid._user) === String(req.user._id));
            let highestBid = bids.reduce((bid_1, bid_2) => bid_1.price > bid_2.price ? bid_1 : bid_2);
            let highestPrice = highestBid.price;

            let newBid = {
                date,
                _user: req.user._id,
                price
            };

            if (existingBid.length) {
                const index = auction.bids.indexOf(existingBid[0]);
                auction.bids[index].date = newBid.date;
                auction.bids[index]._user = newBid._user;
                auction.bids[index].price = newBid.price;
            } else {
                auction.bids.push(newBid);
            }
            
            auction.price.current_price = price > highestPrice ? 
                (price > highestPrice + 10 ? highestPrice + 10 : price) 
                : 
                (price + 10 < highestPrice ? price + 10 : highestPrice);

        } else {
            auction.bids.push(
                { 
                    date,
                    _user: req.user._id,
                    price
                }
            );
            auction.price.current_price = price;
        }

        const bidder_ids = auction.bids.map(bid => ObjectId(bid._user));
        const bidders = await User.find({ _id: { $in: bidder_ids }}, { firstname: 1, lastname: 1 }).lean();

        auction.bids = auction.bids.sort((bid_1, bid_2) => {
            if (bid_1.price > bid_2.price) return -1;
            if (bid_1.price < bid_2.price) return 1;
            return 0;
        });

        await auction
            .save()
            .then(async doc => {
                req.session.message = 'Wziąłeś udział w licytacji';
                doc = doc.toObject();
                
                let bidders_object = {};

                bidders.map(bidder => (bidders_object[bidder._id] = bidder ));
                doc.bidders = bidders_object;

                res.send(doc);
            },
            err => {
                req.session.error = 'Nastąpił błąd podczas licytacji. Spróbuj jeszcze raz';
                console.log(err);
                auction = auction.toObject();
                
                let bidders_object = {};
                bidders.map(bidder => (bidders_object[bidder._id] = bidder ));
                auction.bidders = bidders_object;

                res.send(auction);
            });
    });

    app.post('/auction/like/:id', requireLogin, async (req, res) => {
        const id = req.params.id;
        const auction = await Auction.findOne({ _id: ObjectId(id) });
        auction.likes = auction.likes ? auction.likes + 1 : 1;

        auction.save();
    });

    app.get('/auction/get/:id', async (req, res) => {
        const id = req.params.id;
        const auction = await Auction.findOne({ _id: ObjectId(id) }).lean();
        const bidder_ids = auction.bids.map(bid => ObjectId(bid._user));
        const bidders = await User.find({ _id: { $in: bidder_ids }}, { firstname: 1, lastname: 1 }).lean();

        // auction.bids = auction.bids.sort((bid_1, bid_2) => {
        //     if (bid_1.price > bid_2.price) return -1;
        //     if (bid_1.price < bid_2.price) return 1;
        //     return 0;
        // });

        let bidders_object = {};
        bidders.map(bidder => (bidders_object[bidder._id] = bidder ));
        auction.bidders = bidders_object;

        res.send(auction);
    });

    app.get('/auction/get_front_page_auctions', async (req, res) => {
        const user_id = currentUserId(req);

        console.log('fetching stats');
        const popular = await Auction.find(
            { _user: { $ne: user_id }, ended: { $ne: true } }, 
            { title: 1, shortdescription: 1, price: 1, photos: { $slice: 1 }, likes: 1 }, 
            { limit: 8, sort: { likes: -1 } }
        );
        const newest = await Auction.find(
            { _user: { $ne: user_id }, ended: { $ne: true } },
            { title: 1, shortdescription: 1, price: 1, photos: { $slice: 1 } },
            { limit: 9, sort: { 'date.start_date': -1 } }
        );

        res.send({ popular, newest });
    });

    app.get('/auction/get_all/:page/:per_page', async (req, res) => {
        const page = parseInt(req.params.page);
        const per_page = parseInt(req.params.per_page) || 10;

        const count = await Auction.countDocuments({});
        const auctions = await Auction.find(
            { _user: { $ne: currentUserId(req) } }, 
            { title: 1, shortdescription: 1, price: 1, photos:{ $slice: 1 } }, 
            { skip: (page-1) * per_page, limit: per_page}
        ).lean();
        auctions.push(count);

        res.send(auctions);
    });

    app.get('/auction/search/:category/:query/:page/:per_page', async (req, res) => {
        const category = req.params.category === 'Kategorie' ? '.*' : req.params.category;
        const query = req.params.query === '*' ? '.*' : req.params.query;
        const page = parseInt(req.params.page);
        const per_page = parseInt(req.params.per_page);

        const mongo_query = { 
            _user: { $ne: currentUserId(req) },
            title: { $regex: query, $options: 'i' }, 
            $or: [{ 'categories.main': { $regex: category, $options: 'i' } }, { 'categories.sub': { $regex: category, $options: 'i'} }],
            ended: { $ne: true }
        };
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

        const mongo_query = {
            _user: { $ne: currentUserId(req) },
            title: { 
                $regex: query, $options: 'i' 
            }, 
            'price.start_price': { $lte: max, $gte: min },   // change to current_price 
            $or: [
                { 'categories.main': { $regex: category, $options: 'i' } }, 
                { 'categories.sub': { $regex: category, $options: 'i'} }  
            ],
            ended: { $ne: true }
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

        console.log(category.toUpperCase());
        
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
        const auctions = await Auction.find(
            { _user: { $ne: currentUserId(req) }, ended: { $ne: true } },
            { title: 1, shortdescription: 1, price: 1, photos: { $slice: 1 } }
        ).limit(10);
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
                current_price: data.start_price || 0,
                hide_min_price: data.hide_min_price === 'on'
            },
            date: {
                start_date: new Date().getTime(),
                duration: data.duration
            },
            likes: 0,
            quantity: data.quantity,
            photos: [],
            attributes,
            categories: {
                main: data.main,
                sub: data.sub
            },
            bids: [],
            ended: false,
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

        const user = await User.findOne({ _id: ObjectId(req.user._id) });
        const { credits } = user.balance;
        user.balance.credits = credits ? (+credits - 1) : 4;
        await user.save();

        res.send({});
    });
};