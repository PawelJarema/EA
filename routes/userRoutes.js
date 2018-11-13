const mongoose = require('mongoose');
require('../models/User');

const User = mongoose.model('user');
const { ObjectId } = mongoose.Types;
const regex = require('../services/helpers/regexHelper');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const requireLogin = require('../middleware/requireLogin');

const multer = require('multer');
const upload = multer();

module.exports = app => {
    app.get('/api/current_user', async (req, res) => {
        res.send(req.user);
    });
    
    app.post('/user/destroy', requireLogin, async (req, res) => {
        const id = req.user._id;
        const user = await User.findOne({ _id: ObjectId(id) });
        user.remove();
        
        req.logout();
        req.session.message = 'Pomyślnie usunięto konto';
        res.redirect('/');
    });
    
    app.post('/user/delivery', [requireLogin, upload.any()], async (req, res) => {
        const all = req.body;

        let deliveries = [],
            delivery = {};

        for (let name in all) {
            let value = all[name];

            if (name.indexOf('delivery') !== -1) {
                delivery.name = value;
            } else {
                delivery.price = parseInt(value);
                deliveries.push(delivery);
                delivery = {};
            }
        }

        let user = await User.findOne({ _id: ObjectId(req.user._id)});

        if (!user) {
            req.session.error = 'Nastąpił błąd. Spróbuj ponownie później';
        }

        user.deliveries = deliveries.filter(d => d.name && d.price);

        console.log(user.deliveries);

        await user.save().then(() => {
            req.session.message = 'Pomyślnie zapisano metody dostawy';
        }, (err) => {
            req.session.error = 'Zapis nie powiódł się. Spróbuj ponownie później';
        });

        res.send(user);
    });

    app.post('/user/update', [requireLogin, upload.any()], async (req, res) => {     
       let r = req.body,
           firstname = r.firstname,
           lastname = r.lastname,
           street = r.street,
           postal = r.postal,
           city = r.city,
           email = r.email,
           invoice_email = r.invoice_email,
           phone = r.phone,
           birthdate = r.birthdate,
           account_number = r.account_number,
           corespondence = r.corespondence,
           password = r.password,
           confirm_password = r.confirm_password;
        
        let messages = [],
            error = false;
               
        let user = await User.findOne({ _id: ObjectId(req.user._id) });
        
        if (!user) {
            error = true;
            req.session.error = 'Awaria bazy danych. Proszę skontaktować się z administratorem';
            res.send(req.user);
        }
 
        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.birthdate = birthdate ? parseInt(birthdate) : user.birthdate;
        user.joindate = user.joindate || new Date().getTime();

        if (!user.address) {
            user.address = {};
        }
        
        user.address.street = street || user.address.street;
        user.address.postal = postal || user.address.postal;
        user.address.city = city || user.address.city;
        
        if (!user.contact) {
            user.contact = {};
        }
        
        let emailCheck = regex.email;
        if (email) {
            if (emailCheck.test(email)) {
                user.contact.email = email;
            } else {
                error = true;
                messages.push('Niepoprawny adres E-mail');
            }
        }
        
        if (invoice_email) {
            if (emailCheck.test(invoice_email)) {
                user.contact.invoice_email = invoice_email
            } else {
                error = true;
                messages.push('Niepoprawny E-mail do faktur.')
            }
        }
        
        user.contact.phone = phone || user.contact.phone; 
        
        if (!user.balance) {
            user.balance = {};
        }
        
        user.balance.account_number = account_number || user.balance.account_number;
        
        if (!user.agreements) {
            user.agreements = { rodo_1: true, rodo_2: true };
        }
        
        user.agreements.corespondence = corespondence === 'on' || user.agreements.corespondence;
        
        await user.save()
            .then(() => {
                messages.push('Pomyślnie zapisano dane');
            }, 
            (err) => {
                error = true;
                console.log(err);
                messages.push('W zapisie danych nastąpił błąd');
            });
        
        if (password || confirm_password) {
            let passCheck = regex.password;
            
            if (passCheck.test(password) && password === confirm_password) {
                const hash = await new Promise((resolve, reject) => {
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if (err) reject(err);
                        resolve(hash);
                    });
                });
                
                console.log('hash', hash);
                
                if (user.security) {
                    user.security.password = hash;
                } else {
                    user.security = { password: hash, verified: true };
                }
                
                await user.save()
                .then(() => {
                   messages.push('Hasło zmienione pomyślnie'); 
                },
                (err) => {
                    error = true;
                    console.log(err);
                    messages.push('Zapisanie hasła nie powiodło się');
                });
            } else {
                error = true;
                if (password !== confirm_password) {
                    messages.push('Nie zapisano hasła. Hasło i potwierdzenie muszą być identyczne');
                } else if (password.length < 8) {
                    messages.push('Hasło musi zawierać przynajmniej 8 znaków');
                }
            }
        }
      
        if (error) {
            req.session.error = messages.join('. ');
        } else {
            req.session.message = messages.join('. ');
        }
        
        res.send(user || req.user);
        
    });
}