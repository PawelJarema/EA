const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const util = require('util');

require('../models/Category');
require('../models/Auction');
require('../models/User');
const Auction = mongoose.model('auction');
const User = mongoose.model('user');
const Category = mongoose.model('category');
const Subcategory = mongoose.model('subcategory');
const SubSubCategory = mongoose.model('sub_subcategory');
const Property = mongoose.model('property');

const categoryTree = require('../client/src/categories/categories');

// kategoria, tytuł i cena, atrybuty, opis

const random = function(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

const isArray = function(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

module.exports = app => {
    app.post('/api/reconstruct-categories', async (req, res) => {
        await Category.deleteMany({});
        await Subcategory.deleteMany({});
        await SubSubCategory.deleteMany({});
        await Property.deleteMany({});

        for (let key in categoryTree) {
            const
                category = new Category({
                    name: key,
                    subcategories: []
                }),
                subcategoryObject  = categoryTree[key];
            

            for (let subKey in subcategoryObject) {
                const
                    subcategory = new Subcategory({
                        name: subKey,
                    }),
                    subSubCategoryObject = subcategoryObject[subKey];

                if (isArray(subSubCategoryObject)) {
                    // create subcategory with props
                    subcategory.properties = [];

                    for (let i = 0; i < subSubCategoryObject.length; i++) {
                        const prop = new Property(subSubCategoryObject[i]);
                        subcategory.properties.push(prop);
                    }

                    subcategory.markModified('properties');
                } else {
                    // iterate third level
                    subcategory.sub_subcategories = [];
                    for (let subSubKey in subSubCategoryObject) {
                        const
                            properties      = subSubCategoryObject[subSubKey],
                            sub_subcategory = new SubSubCategory({
                                name: subSubKey,
                                properties: []
                            });

                        if (properties !== null) {
                            for (let i = 0; i < properties.length; i++) {
                                const prop = new Property(properties[i]);
                                sub_subcategory.properties.push(prop);
                            }
                        }

                        sub_subcategory.markModified('properties');
                        await sub_subcategory.save();
                        subcategory.sub_subcategories.push(sub_subcategory);
                        subcategory.markModified('sub_subcategories');
                    }
                }

                await subcategory.save();
                category.subcategories.push(subcategory);
            }

            await category.save();
        }

        req.session.message = "Przywrócono domyślny zestaw kategorii";
        res.send(true);
    });

    app.get('/api/seedauctions', async (req, res) => {
        const howMany = 200;

        const users = await User.find({}, { _id: 1}).lean();
        const user_ids = users.map(user => user._id);

        for (let i = 0; i < howMany; i++) {

            const category_keys = Object.keys(seedData);
            const main = category_keys[random(0, category_keys.length - 1)];
            const sub_categories = seedData[main];

            const sub = sub_categories[random(0, sub_categories.length - 1)];

            
            const _user = ObjectId(user_ids[random(0, user_ids.length)]);
            const title = titles[random(0, titles.length - 1)];
            const start_price = random(50, 2500);
            const attr_name = attributes[random(0, attributes.length - 1)];
            const attribute = { name: attr_name, value: values[attr_name][random(0, values[attr_name].length - 1)] };
            const quantity = random(1, 20);
            const shortdescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi.';

            const start_date = new Date().getTime();

            await new Auction({
                _user,
                title,
                shortdescription,
                price: { start_price, current_price: start_price },
                date: { start_date, duration: 10 },
                quantity: quantity,
                photos: [],
                attributes: [attribute],
                categories: { main, sub },
                verified: true
                
            }).save().then(() => console.log(title + ' created'), (err) => console.log('error', err));
        }

    });

    app.get('/api/seeddb', async (req, res) => {   
        for (let name in seedData) {
            let subcategories = [];
            
            seedData[name].forEach(name => {
                subcategories.push(new Subcategory({ name }));
            });
            
            const category = await new Category({ name, subcategories }).save().then((err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data, 'category saved.');
                    data.subcategories.forEach(async subc => {
                        await subc.save().then((err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data, 'subcategory saved.');
                            }
                        });
                    });
                }
            });
        }
    
        console.log('all done!');
    });
}