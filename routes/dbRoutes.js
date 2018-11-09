const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

require('../models/Category');
require('../models/Auction');
const Category = mongoose.model('category');
const Auction = mongoose.model('auction');

mongoose.model('subcategory', require('../models/Subcategory'));
const Subcategory = mongoose.model('subcategory');


const seedData = {
    'Eletkronika': ['RTV i AGD', 'Komputery', 'Mac', 'PC', 'Konsole', 'Telefony i akcesoria', 'Fotografia cyfrowa'],
    'Moda': ['Obuwie', 'Odzież', 'Biżuteria', 'Zegarki'],
    'Dom i ogród': ['Ogród', 'Kwiaty', 'Meble', 'Wyposażenie wnętrz', 'Zwierzęta'],
    'Dziecko': ['Zabawki', 'Ubranka', 'Żywność', 'Artykuły szkolne'],
    'Rozrywka i gry': ['Gry', 'Książka', 'Komiks', 'Muzyka', 'Film', 'Warhammer, gry bitewne', 'Gry planszowe'],
    'Sport': ['Rower', 'Turystyka', 'Boks', 'Bieganie', 'Sztuki walki'],
    'Motoryzacja': ['Samochód', 'Motocykl', 'Quad', 'Opony', 'Części samochodowe'],
    'Sztuka': ['Malarstwo', 'Rysunek', 'Antyki', 'Rękodzieło', 'Wyroby WTZu', 'Artykuły kreatywne'],
    'Firma': ['Oprogramowanie', 'Księgowość', 'Akcesoria przemysłowe', 'Nieruchomości', 'Akcesoria BHP'],
    'Zdrowie': ['Zioła', 'Ubezpieczenie', 'Poradniki', 'Suplementy'],
    'Uroda': ['Makijaż', 'Włosy', 'Kosmetyki', 'Twarz i ciało']
};

const random = function(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

const titles = ['OptiShot 2 symulator golfowy', 'Arccos 360 system analizy gry', 'Game Golf LIVE GPS i system analizy gry w jednym', 'Zepp 2 analizator swingu', 'TomTom Golfer 2 zegarek golfowy z GPS', 'Bushnell NEO iON GPS golfowy', 'Bushnell Tour V4 JOLT dalmierz laserowy', 'Bushnell Tour V4 Ryder Cup Edition dalmierz laserowy', 'Voice Caddie SC200 Launch Monitor dopplerowski radar', 'Telewizor SONY KD-49XF7005', 'Telewizor SAMSUNG UE55NU7442U', 'Telewizor LG 55SK8100PLA', 'Laptop HP Pavilion x360 14-ba016nw i5-7200U/8GB/1TB/INT/Win10 Srebrny', 'Laptop/Tablet 2w1 ACER One 10 S1003-133N Z8350/2GB/64GB eMMC/Win10', 'Laptop LENOVO Yoga 520-14IKBR 81C800J1PB i3-8130U/4GB/256GB SSD/INT/Win10H Onyx Black'];
const attributes = ['Stan', 'Kolor', 'Rozmiar'];
const values = {
    'Stan': ['nowy', 'używany', 'uszkodzony', 'działający', 'dobry', 'jak nowy'],
    'Kolor': ['czerwony', 'niebieski', 'żółty', 'biały', 'szary', 'kremowy', 'zieleń', 'pomarańczowy', 'czarny'],
    'Rozmiar': ['XXL', 'XL', 'L', 'M', 'S', 'XS']
};

// kategoria, tytuł i cena, atrybuty, opis

module.exports = app => {
    app.get('/api/seedauctions', async (req, res) => {
        const howMany = 200;

        for (let i = 0; i < howMany; i++) {

            const category_keys = Object.keys(seedData);
            const main = category_keys[random(0, category_keys.length - 1)];
            const sub_categories = seedData[main];

            const sub = sub_categories[random(0, sub_categories.length - 1)];

            

            const title = titles[random(0, titles.length - 1)];
            const start_price = random(50, 2500);
            const attr_name = attributes[random(0, attributes.length - 1)];
            const attribute = { name: attr_name, value: values[attr_name][random(0, values[attr_name].length - 1)] };
            const quantity = random(1, 20);
            const shortdescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque sed, lacinia in, mi.';

            const start_date = new Date().getTime();

            await new Auction({
                _user: ObjectId(),
                title,
                shortdescription,
                price: { start_price },
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