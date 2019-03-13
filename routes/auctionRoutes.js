const requireLogin          = require('../middleware/requireLogin');
const multer                = require('multer');
const upload                = multer();

const mongoose              = require('mongoose');
const { ObjectId }          = mongoose.Types;
require('../models/User');
require('../models/Auction');
require('../models/Category');
require('../models/Rate');
require('../models/Like');
require('../models/Views');
const User                  = mongoose.model('user');
const Auction               = mongoose.model('auction');
const Category              = mongoose.model('category');
const Rate                  = mongoose.model('rate');
const Like                  = mongoose.model('like');
const Views                 = mongoose.model('views');

const Imagemin              = require('imagemin');
const imageminPngquant      = require('imagemin-pngquant');
const imageminSvgo          = require('imagemin-svgo');
const imageminMozjpeg       = require('imagemin-mozjpeg');
const imageminGifsicle      = require('imagemin-gifsicle');

const Sharp = require('sharp');

const buyNowWonTemplate         = require('../services/emailTemplates/buyNowWonTemplate');
const buyNowItemSoldTemplate    = require('../services/emailTemplates/buyNowItemSoldTemplate');
const bidTemplate               = require('../services/emailTemplates/bidTemplate');
const itemSentTemplate          = require('../services/emailTemplates/itemSentTemplate');
const Mailer                    = require('../services/Mailer');

const helpers = require('../services/helpers/otherHelpers');
const { filterUnique } = require('./functions');

// const util = require('util');

const currentUserId = (req) => {
    if (req.user) {
        return ObjectId(req.user._id);
    } else {
        return null;
    }
}

let global_user_cache = {};

// data row for marking as sent / rating buyers
async function makeRow(user_id, auction, fromAuctionNotBuyNow, toSend, toRate) {
    const user = global_user_cache[user_id] ? global_user_cache[user_id] : global_user_cache[user_id] = await User.findOne({ _id: user_id });

    return ({
        count: (fromAuctionNotBuyNow ? 1 : auction.buynowpaid.filter(id => String(id) === String(user._id)).length),
        auction: {
            _id: auction._id,
            title: auction.title
        },
        user: {
            _id: user._id,
            name: helpers.userNameHelper(user),
            firm: helpers.userFirmHelper(user),
            address: helpers.userAddressHelper(user),
            contact: helpers.userContactHelper(user)
        },
        toSend,
        toRate
    });
}

module.exports = app => {
    app.post('/auction/rate_buyer', requireLogin, async (req, res) => {
        const rate = req.body;

        rate._user = ObjectId(rate._user);
        rate._rater = ObjectId(req.user._id);

        let 
            person_index = req.user.toRate.indexOf(rate._user);

        if (person_index !== -1) {
            req.user.toRate = req.user.toRate.slice(0, person_index).concat(req.user.toRate.slice(person_index + 1));
            // console.log(req.user.toRate);

            await req.user.save();
        }

        const auction = await Auction.findOne({ _id: ObjectId(rate._auction) });
        if (!auction.ended || +rate.count > 1) {
            auction.buynowpaid = auction.buynowpaid.filter(id => String(id) !== String(rate._user));
            await auction.save();
        }
        
        delete rate._auction;
        delete rate.count;

        const newRate = new Rate(rate).save().then(
            doc => res.send(true),
            err => res.send(false)
        );
    });

    app.post('/auction/send_items', requireLogin, async (req, res) => {
        const
            { auction_id, auction_title, count, user_id, user_email } = req.body;
            data = {
                subject: 'Właśnie wysłano do Ciebie przedmiot: ' + auction_title,
                recipients: [{ email: user_email }]
            },

            mailer = new Mailer(data, itemSentTemplate(auction_id, auction_title));

        mailer.send();

        const 
            _auction_id = ObjectId(auction_id),
            _user_id = ObjectId(user_id),
            auction = await Auction.findOne({ _id: _auction_id });
        //  boughtNow = auction.buynowpaid.indexOf(_user_id) !== -1,

        //  removeBuyer = id => String(id) !== user_id;

        helpers.sendChatMessageOnItemSend(_user_id, auction._user, auction, 0, count);

        // if (boughtNow) {
        //     auction.buynowpaid = auction.buynowpaid.filter(removeBuyer);
        // } else {
        //     auction.auctionpaid = auction.auctionpaid.filter(removeBuyer);
        // }

        let 
            buyer_index = req.user.toSend.indexOf(_user_id);

        if (buyer_index !== -1) {
            req.user.toSend = req.user.toSend.slice(0, buyer_index).concat(req.user.toSend.slice(buyer_index + 1))
        }

        if (req.user.toRate) {
            req.user.toRate.push(_user_id);
        } else {
            req.user.toRate = [_user_id];
        }
        
        await req.user.save();

        await auction
            .save()
            .then(
                doc => res.send(true),
                err => res.send(false)
            );
    });

    app.post('/auction/send_and_rate_rows', requireLogin, async (req, res) => {
        const
            rows = [],
            owner = req.user,
            projection = { _id: 1, title: 1, buynowpaid: 1, auctionpaid: 1 },

            itemsToSendAuction = await Auction.find({
                _user: owner._id, 
                auctionpaid: { $in: owner.toSend }
            }, projection),

            usersToRateAuction = await Auction.find({
                _user: owner._id,    
                auctionpaid: { $in: owner.toRate }
            }, projection),

            itemsToSendBuyNow = await Auction.find({ 
                _user: owner._id, 
                buynowpaid: { $in: owner.toSend }
            }, projection),

            usersToRateBuyNow = await Auction.find({
                _user: owner._id,    
                buynowpaid: { $in: owner.toRate }
            }, projection);

            // console.log(owner.toRate);

        for (let i = 0; i < itemsToSendAuction.length; i++) {
            // console.log('auction item found');

            const auction = itemsToSendAuction[i];
            rows.push(await makeRow(
                auction.auctionpaid[0],
                auction,
                true,
                true,
                false
            )); 
        }

        for (let i = 0; i < itemsToSendBuyNow.length; i++) {
            // console.log('buy now items found');

            const 
                auction = itemsToSendBuyNow[i],
                buyers = auction.buynowpaid.filter(filterUnique);

            for (let j = 0; j < buyers.length; j++) {
                rows.push(await makeRow(
                    buyers[j],
                    auction,
                    false,
                    true,
                    false
                ));
            }
        }

        for (let i = 0; i < usersToRateAuction.length; i++) {
            // console.log('users to rate auction found')
            const auction = usersToRateAuction[i];
            rows.push(await makeRow(
                auction.auctionpaid[0],
                auction,
                true,
                false,
                true
            )); 
        }

        for (let i = 0; i < usersToRateBuyNow.length; i++) {
            // console.log('users to rate buynow found')
            const 
                auction = usersToRateBuyNow[i],
                buyers = auction.buynowpaid.filter(filterUnique);

            for (let j = 0; j < buyers.length; j++) {
                rows.push(await makeRow(
                    buyers[j],
                    auction,
                    false,
                    false,
                    true
                ));
            }
        }

        global_user_cache = {};

        // console.log(rows);
        res.send(rows);
    });

    app.get('/auction/:id/photo', async (req, res) => {
        const { id }    = req.params,
                auction = await Auction.findOne({ _id: ObjectId(id) }, { photos: { $slice: 1 } }),
                photo   = auction.photos[0];

        if (!photo) {
            res.send(false);
            return;
        }
                
        const img       = Buffer.from(photo.data, 'base64');

        res.writeHead(200, {
            'Content-Type': photo.type || 'image/jpeg',
            'Content-Length': img.length
        });
        res.end(img);
    });

    app.get('/auction/:id/photos', async (req, res) => {
        const { id } = req.params;
        const auction = await Auction.findOne({ _id: ObjectId(id) }, { photos: 1 });
        res.send(auction.photos);
    });

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
        const { page, per_page } = req.params,
                mode             = req.body.mode,
                user_id          = req.user._id;

        let query;
        if (mode === 'ended') {
            query = { 
                $or: [
                    {
                        $and: [
                            { bids: { $elemMatch: { _user: user_id }}},
                            { ended: (mode === 'ended' ? true : ({ $ne: true })) }
                        ]
                    },
                    { 
                        $or: [
                            { buynowpayees: user_id },
                            { payees: user_id },
                            { buynowpaid: user_id }
                        ] 
                    }
                ],
                
            };
        } else {
            query = { 
                bids: { $elemMatch: { _user: user_id }}, 
                ended: (mode === 'ended' ? true : ({ $ne: true }))
            };
        }
        const projection = { _user: 1, title: 1, shortdescription: 1, price: 1, bids: 1, date: 1, ended: 1, rated: 1, payees: 1, buynowpayees: 1, raters: 1 }; // photos: { $slice: 1 },
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

    app.post('/auction/my_liked_bids/:page/:per_page', requireLogin, async (req, res) => {
        const { page, per_page } = req.params;

        const likes = await Like.find({ _user: ObjectId(req.user._id) })
            .lean();
        const idArray = likes.map(like => ObjectId(like._auction));

        const query = { _id: { $in: idArray }, ended: { $ne: true }};
        const projection = { _user: 1, title: 1, shortdescription: 1, price: 1, bids: 1, date: 1, ended: 1, rated: 1, payees: 1, buynowpayees: 1, raters: 1 }; // photos: { $slice: 1 },
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
        const projection = { title: 1, shortdescription: 1, price: 1, bids: 1, date: 1, ended: 1 }; // photos: { $slice: 1 },
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
            auction.buynowpayees.push(user._id);
        } else {
            auction.buynowpayees = [user._id];
        }

        auction.bids = auction.bids.filter(bid => String(bid._user) !== String(user._id));

        if (auction.quantity === 0) {
            auction.ended = true;
        }

        await auction.save().then(
            async doc => {
                req.session.message = 'Kupiłeś ' + auction.title;
                res.send(await addBidders(doc));

                buyNowNotifications(user, owner, doc);
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

        if (+price < +auction.price.start_price) {
            res.send(false);
            return;
        }

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
                (highestPrice > price + 10 ? price + 10 : highestPrice);

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

        let bidMessage = 'Podbij stawkę, aby wyjść na prowadzenie.';
        if (String(auction.bids[0]._user) === String(req.user._id)) {
            bidMessage = 'Gratulujemy, w chwili obecnej prowadzisz w licytacji!';
        }

        const mailer = new Mailer({
            subject: 'Wziąłeś udział w licytacji przedmiotu ' + auction.title,
            recipients: [{ email: req.user.contact.email }]
        }, bidTemplate(auction._id, auction.title, bidMessage, price));
        mailer.send();

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
        const   id          = req.params.id,
                likeBool    = req.body.like,
                auction     = await Auction.findOne({ _id: ObjectId(id) }),
                likeObj     =  { _user: ObjectId(req.user._id), _auction: ObjectId(auction._id) };

        let     like        = await Like.findOne(likeObj);

        if (likeBool && !like) {
            auction.likes   = auction.likes ? auction.likes + 1 : 1;
            await new Like(likeObj).save();
        } else if (!likeBool && like) {
            auction.likes   = auction.likes - 1;
            await like.remove();
        }
     
        await auction.save();
    });

    app.get('/auction/edit/:id', requireLogin, async (req, res) => {
        const id = req.params.id;
        let auction = await Auction.findOne(
            { _id: ObjectId(id) }, 
            {}
        ).lean();
        const bidder_ids = auction.bids.map(bid => ObjectId(bid._user));
        const bidders = await User.find({ _id: { $in: bidder_ids }}, { firstname: 1, lastname: 1 }).lean();

        if (req.user) {
            const liked = await Like.findOne({ _user: req.user._id, _auction: auction._id });
            auction.liked = Boolean(liked);
        }

        let bidders_object = {};
        bidders.map(bidder => (bidders_object[bidder._id] = bidder ));
        auction.bidders = bidders_object;
  
        res.send(auction);
    });

    app.get('/auction/get/:id', async (req, res) => {
        const id = req.params.id;
        let auction = await Auction.findOne(
            { _id: ObjectId(id) }, 
            {},
            { select: '-photos' }
        ).lean();
        const bidder_ids = auction.bids.map(bid => ObjectId(bid._user));
        const bidders = await User.find({ _id: { $in: bidder_ids }}, { firstname: 1, lastname: 1 }).lean();

        // auction.bids = auction.bids.sort((bid_1, bid_2) => {
        //     if (bid_1.price > bid_2.price) return -1;
        //     if (bid_1.price < bid_2.price) return 1;
        //     return 0;
        // });

        if (req.user) {
            const liked = await Like.findOne({ _user: req.user._id, _auction: auction._id });
            auction.liked = Boolean(liked);
        }

        let bidders_object = {};
        bidders.map(bidder => (bidders_object[bidder._id] = bidder ));
        auction.bidders = bidders_object;
  
        res.send(auction);
    });

    app.post('/auction/front_page_auctions/:mode', async (req, res) => {
        const 
            { mode } = req.params,
            { itemCount, itemsPerFetch } = req.body;

        let 
            query = { ended: { $ne:true } };

        switch(mode) {
            case 'promoted':
                query['premium.isPremium'] = true;
                break;
            case 'new':
                break;
        }

        const auctions = await Auction.find(
            query, 
            { title: 1, shortdescription: 1, price: 1, date: 1 },
            { 
                sort: { 'date.start_date': -1 }, 
                skip: +itemCount, 
                limit: +itemsPerFetch 
            }
        );

        res.send(auctions);
    });

    app.get('/auction/get_front_page_auctions', async (req, res) => {
        const user_id = currentUserId(req);

        const popular = await rotatePremium();


        const newest = await Auction.find(
            { ended: { $ne: true } },
            { title: 1, shortdescription: 1, price: 1, date: 1 }, // photos: { $slice: 1 },
            { sort: { 'date.start_date': -1 }, limit: 9 }
        );

        res.send({ popular, newest });
    });

    app.post('/auction/filter', upload.any(), async (req, res) => {
        let { seller, title, sort, page, per_page } = req.body,
            max = 9999999, min = 1;

        if (per_page > 100) per_page = 100;
        if (per_page < 1) per_page = 1;

        const
            category        = req.body.category || null,
            subcategory     = req.body.subcategory || null,
            subsubcategory  = req.body.subsubcategory || null;

         console.log(req.body);
         console.log(category, subcategory, subsubcategory);

         
        const
            keys                    = Object.keys(req.body),
            property_keys           = keys.filter((key) => key.startsWith('_')),
            property_$and           = [];

        for (let i = 0; i < property_keys.length; i++) {
            const
                key      = property_keys[i],
                name     = key.replace('_', ''),
                value    = req.body[key];


            if (typeof value === 'string') {

                property_$and.push({ 'properties': { $elemMatch: { name, value }}});

            } else if (typeof value === 'object') {

                const innerProps = value;

                if (innerProps['od'] || innerProps['do']) {
                    // range input
                    const
                        _od = parseInt(innerProps['od']) || 1,
                        _do = parseInt(innerProps['do']) || 9999999;

                    // nie używamy Ceny - stosujemy wartości min i max z kodu spadkowego
                    if (name === 'Cena') {
                        min = Math.min(_od, _do);
                        max = Math.max(_od, _do);
                    } else {
                        property_$and.push({ 'int_properties' : { $elemMatch: { name, value: { $gte: Math.min(_od, _do), $lte: Math.max(_od, _do) }}}});
                    }

                } else {
                    // multiple input
                    const
                        propNames = Object.keys(innerProps);
                    
                    if (propNames.indexOf('wszystkie') !== -1) {
                        continue;
                    } else {
                        property_$and.push({ 'properties': { $elemMatch: { name , value: { $in: propNames }}}});
                    }
                }
            }
        }

        let user = seller ? await findUserByNames((!seller || seller === '*' ? '.*' : seller)) : null;

        title    = !title || title === '*' ? '.*' : title;
        page     = parseInt(page) || 1;
        per_page = parseInt(per_page) || 10;

        switch(sort) {
            case 'najnowsze':
                sort = { 'premium.forever': -1, 'premium.isPremium': -1, 'date.start_date': -1 };
                //sort = [[ 'date.start_date', -1 ]];
                break;
            case 'alfabetycznie':
                sort = { 'premium.forever': -1, 'premium.isPremium': -1, 'title': 1 };
                //sort = [[ 'title', 1 ]];
                break;
            case 'najtańsze':
                sort = { 'premium.forever': -1, 'premium.isPremium': -1, 'price.start_price': 1 };
                //sort = [[ 'price.start_price', 1 ]];
                break;
            case 'najdroższe':
                sort = { 'premium.forever': -1, 'premium.isPremium': -1, 'price.start_price': -1 };
                //sort = [[ 'price.start_price', -1 ]];
                break;
            case 'najpopularniejsze':
                sort = { 'premium.forever': -1, 'premium.isPremium': -1, 'likes': -1 };
                //sort = [[ 'likes', -1 ]];
                break;
            case 'kończące się':
                sort = { 'premium.forever': -1, 'premium.isPremium': -1, 'date.duration': 1, 'date.start_date': 1 };
                //sort = [[ 'date.duration', 1 ], [ 'date.start_date', 1 ]];
                break;
            default:
                sort = { 'premium.forever': -1, 'premium.isPremium': -1 };
                //sort = [];
        }

        // sort.unshift([ 'premium.isPremium', 1 ]);
        // sort.unshift([ 'premium.forever', 1 ]);

        const mongo_query = {
            title: { 
                $regex: title, $options: 'i' 
            }, 
            'price.current_price': { $lte: max, $gte: min },
            ended: { $ne: true }
        };

        if (category) mongo_query['categories.main'] = category;
        if (subcategory) mongo_query['categories.sub'] = subcategory;
        if (subsubcategory) mongo_query['category.subsub'] = subsubcategory;

        // properties
        if (property_$and.length > 0) {
            mongo_query['$and'] = property_$and;
        }
        
        const projection = { _user: 1, title: 1, shortdescription: 1, price: 1, date: 1, premium: 1 }; // photos:{ $slice: 1 }
        const options = { skip: (page-1) * per_page, limit: per_page };
        
        if (sort) {
            options.sort = sort;
        }

        const count = await Auction.countDocuments(mongo_query);
        const auctions = await Auction.find(mongo_query, projection, options).lean();

        await checkIfLiked(auctions, req);
        auctions.push(Math.ceil(count / per_page));

        res.send(auctions);
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

        await checkIfLiked(auctions, req);
        auctions.push(count);

        res.send(auctions);
    });

    app.get('/auction/search/:category/:query/:page/:per_page', async (req, res) => {
        const category = req.params.category === 'Kategorie' ? '.*' : req.params.category;
        const query = req.params.query === '*' ? '.*' : req.params.query;
        const page = parseInt(req.params.page);
        const per_page = parseInt(req.params.per_page);

        let mongo_query;
        if (category === 'Szukaj Sprzedawcy') {
            mongo_query = {
                ended: { $ne: true }
            };
            
            const user = await findUserByNames(query);
            if (user) {
                mongo_query._user = user._id;
            }
        } else {
            mongo_query = { 
                _user: { $ne: currentUserId(req) },
                title: { $regex: query, $options: 'i' }, 
                $or: [{ 'categories.main': { $regex: category, $options: 'i' } }, { 'categories.sub': { $regex: category, $options: 'i'} }],
                ended: { $ne: true }
            };
        }
  
        const projection = { title: 1, shortdescription: 1, price: 1, date: 1, photos:{ $slice: 1 } };
        const options = { skip: (page-1) * per_page, limit: per_page };

        const count = await Auction.countDocuments(mongo_query);
        const auctions = await Auction.find(mongo_query, projection, options).lean();

        await checkIfLiked(auctions, req);
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

        const projection = { title: 1, shortdescription: 1, price: 1, date: 1, photos:{ $slice: 1 } };
        const options = { skip: (page-1) * per_page, limit: per_page };
        
        if (sort) {
            options.sort = { [sort[0]]: sort[1] };
        }

        const count = await Auction.countDocuments(mongo_query);
        const auctions = await Auction.find(mongo_query, projection,options).lean();

        await checkIfLiked(auctions, req);
        auctions.push(count);

        res.send(auctions);
    });

    app.get('/auction/count/:category', async (req, res) => {
        const category = req.params.category;
        
        const mains = await Category.find({}).lean();
        const main_names = mains.map(c => c.name);

        const is_main = category === 'Kategorie' || main_names.indexOf(category) !== -1;
        const is_user = category === 'Szukaj Sprzedawcy';
        
        if (is_main || is_user) {
            let result = [];
            let items = 0;

            if (is_user) {
                return([]);
                await main_names.map(async c => {
                    const user = await findUserByNames(category);
                    let query = { 'categories.main': c };
                    Auction
                        .count(query)
                        .then(count => {
                            result.push({ name: c, count });
                            items++;
                            if (items === main_names.length) {
                                res.send(result);
                            }
                        })
                });
            } else {
                await main_names.map(c => { 
                    Auction
                        .count({ 'categories.main': c })
                        .then(count => { 
                            result.push({ name: c, count });
                            items++;
                            if (items === main_names.length) {
                                res.send(result);
                                return;
                            }
                        }, 
                        (err) => console.log('error'));
                });
            }

            
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
        const update = data.auction_id ? true : false;
        //const attributes = Object.keys(data).filter(key => key.startsWith('attribute_')).map(key => ({ name: key.replace('attribute_', ''), value: data[key] }));
        const
            keys = Object.keys(data),
            properties = [], 
            int_properties = [],
            deliveries = [];

        keys.filter(key => key.startsWith('property_')).map(key => {
            const 
                name  = key.replace('property_', ''),
                value = data[key];

            // oznakowane wartości liczbowe
            if (name.startsWith('%')) {
                int_properties.push({ name: name.slice(1), value: parseInt(value) });
            } else {
                properties.push({ name, value });
            }
        });

        keys.filter(key => key.startsWith('delivery_')).map(key => {
            const 
                arr = key.split('_'),
                name = arr[1],
                price = parseInt(arr[2]);

            if (name && price >= 0) {
                deliveries.push({ name, price });
            } 
        });

        let auction = new Auction({
            _user: ObjectId(req.user._id),
            title: data.title,
            shortdescription: data.shortdescription,
            description: data.description,
            price: {
                start_price: data.start_price || 1,
                min_price: data.min_price,
                buy_now_price: data.buy_now_price,
                current_price: data.start_price || 1,
                hide_min_price: data.hide_min_price === 'on'
            },
            date: {
                start_date: new Date().getTime(),
                duration: data.duration
            },
            likes: 0,
            quantity: data.quantity,
            photos: [],
            //attributes,
            categories: {
                main: data.category,
                sub: data.subcategory,
                subsub: data.subsubcategory
            },
            bids: [],
            ended: false,
            verified: false,
            properties,
            int_properties,
            deliveries
        });

        console.log(auction);

        if (update) {
            auction._id             = ObjectId(data.auction_id);
            auction.date.start_date = data.start_date || new Date().getTime();

            const oldAuction        = await Auction.findOne({ _id: ObjectId(data.auction_id) });

            auction.price.start_price   = oldAuction.price.start_price || 1;
            auction.price.current_price = oldAuction.price.current_price;
            auction.bids            = oldAuction.bids;
            auction.payees          = oldAuction.payees;
            auction.buynowpayees    = oldAuction.buynowpayees;
            auction.raters          = oldAuction.raters;

            delete auction._id;

            Auction.findOneAndUpdate({ _id: ObjectId(data.auction_id) }, auction, function(err, doc) {
                if (err) {
                    console.log('error', err); 
                    req.session.error = 'Edycja aukcji nie powiodła się';
                    res.send(false);
                    return;
                }  

                if (doc) {
                    req.session.message = 'Pomyślnie dokonano edycji aukcji';
                    res.send(doc);
                }
            });
        } else {
            await auction
                .save()
                .then(
                    async doc => { 
                        req.session.message = 'Pomyślnie dodano aukcję';
                        
                        // const user = req.user;
                        // const { credits } = user.balance;
                        // user.balance.credits = credits ? (+credits - 1) : 4;
                        // user.save();
                        res.send(doc);
                    },
                    (err) => { console.log(err); req.session.error = 'Utworzenie aukcji nie powiodło się'; res.send(false); return;}
                );
        }
    });

    app.post('/auction/post_photos', [requireLogin, upload.any()], async (req, res) => {
        const _id   = req.body._id || null,
              files = req.files;

        const auction = (
            _id 
            ? 
            await Auction.findOne({ _id: ObjectId(_id) })
            :
            await Auction.findOne({ _user: req.user._id }, null, { sort: { 'date.start_date' : -1 } })
        );

        if (auction) {
            savePhotos(auction, files);
            res.send(true);
        } else {
            res.send(false);
        }
    });
};

async function savePhotos(auction, files) {
    const promises = await files.map((file, index) => ({
        order: index,
        type: file.mimetype,
        data: Sharp(file.buffer).resize(1024).toBuffer() // withMetadata()
    }));

    let progress = 0;

    promises.map(promise => {
        const 
            type  = promise.type,
            order = promise.order;

        promise.data.then(buffer => {
            Imagemin.buffer(buffer, {
                plugins: [
                    imageminMozjpeg({ quality: 80 }),
                    imageminPngquant({ quality: 80 }),
                    imageminSvgo(),
                    imageminGifsicle()
                ]
            }).then(optimisedBuffer => {
                progress++;

                auction.photos[order] = { type: type, data: optimisedBuffer.toString('base64') };

                if (progress === files.length) {
                    auction.save(); 
                }
            });
        });
    });
}

async function findUserByNames(query) {
    let names = query.split(' ');
    let name_array = [names[0] ? new RegExp(names[0], 'i') : null, names[1] ? new RegExp(names[1], 'i') : null];
    return await User.findOne({ $or: [ {firstname: { $in: name_array }}, {lastname: { $in: name_array }} ] }, { _id: 1 });
}

async function checkIfLiked(auctions, req) {
    if (!req.user) {
        return;
    }

    let 
        ids         = await Like
            .find({ _user: ObjectId(req.user._id) })
            .lean(); 
        ids         = ids.map(like => String(like._auction));

    if (ids && ids.length) {
        return auctions.map(auction => {
            if (ids.indexOf(String(auction._id)) !== -1) 
                auction.liked = true;
            return auction;
        });
    }
}

function sortByViews(a, b) {
    if (a.views > b.views) return 1;
    if (a.views < b.views) return -1;
    return 0;
} 

async function rotatePremium() {
    let 
        premiums = await Auction.find(
            { ended: { $ne: true }, 'premium.isPremium': true }, 
            { title: 1, shortdescription: 1, price: 1, date: 1 }, //photos: { $slice: 1 },
        ).lean();

    for (let i = 0; i < premiums.length; i++) {
        const 
            auction = premiums[i],
            views = await Views.findOne({ _auction: auction._id });

        auction.views = views.views || 0;
    }

    return premiums.sort(sortByViews).slice(0, 8);
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
    const username = `${user.firstname || ''} ${user.lastname || (!user.firstname ? 'Anonim' : '')}`;
    
    subject = 'Kupiłeś przedmiot ' + auction.title;
    recipients = [{ email: user.contact.email }];
    mailer = new Mailer({ subject, recipients }, buyNowWonTemplate(auction._id, auction.title, price));
    res = await mailer.send();

    subject = `${username} kupi od Ciebie ${auction.title} w opcji Kup Teraz`;
    recipients = [{ email: owner.contact.email }];
    mailer = new Mailer({ subject, recipients }, buyNowItemSoldTemplate(auction._id, auction.title, username, price));
    res = await mailer.send();

    helpers.sendChatMessagesOnAuctionEnd(user._id, owner._id, auction, price);
}