const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

require('../models/Category');
const Category = mongoose.model('category');

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

module.exports = app => {
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