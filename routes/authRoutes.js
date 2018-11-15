const passport = require('passport');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/User');
const User = mongoose.model('user');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const Mailer = require('../services/Mailer');
const Business = require('../services/emailTemplates/business');

module.exports = app => {
    app.get('/api/password/:email', async (req, res) => {
        const email = req.params.email;

        const randomPass = (length) => {
            const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ1234567890._-'.split('');
            let password = '';

            for (let i = 0; i < length; i++) {
                password += chars[parseInt(Math.random() * (chars.length - 1))];
            }

            return password;
        }

        const user = await User.findOne({ 'contact.email': email });

        if (!user) {
            req.session.error = 'Nieprawidłowy adres email';
            res.redirect('/konto/zaloguj');
        }

        const temp_password = randomPass(30);
        await bcrypt.hash(temp_password, saltRounds, async (err, hash) => {
            if (err) {
                req.session.error = 'Nastąpił nieoczekiwany błąd. Spróbuj później';
                res.redirect('/konto/zaloguj');
            }

            user.security.password = hash;

            const recipients = [{ email }];
            const subject = "Hasło tymczasowe do serwisu " + Business.name;
            const mailer = new Mailer({ subject, recipients }, require('../services/emailTemplates/remindPasswordTemplate')(temp_password));
            await mailer.send();
            
            req.session.message = "Na podany E-mail zostało wysłane hasło tymczasowe. Po zalogowaniu możesz je zmienić w Ustawieniach";
            
            await user.save();

            res.redirect('/konto/zaloguj');
        });

    }); 

    app.post('/auth/login', async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        
        const user = await User.findOne({ 'contact.email' : email });
        
        if (!user) {
            req.session.error = "Nie znaleziono użytkownika";
            res.redirect('/konto/zaloguj');
        }

        await bcrypt.compare(password, user.security.password, (err, success) => {
            if (err) {
                req.session.error = "Brak hasła dla tego konta. Zaloguj się przez media społecznościowe w panelu 'Zarejestruj się'";
                console.log(err);
                res.redirect('/konto/zaloguj');
            } else {
                if (success) {
                    req.login(user, function(err) {
                        if (err) {
                            req.session.error = "Nastąpił błąd";
                            console.log('err');
                            res.redirect('/konto/zaloguj');
                        } else {
                            req.session.message = "Zalogowano pomyślnie";
                            res.redirect('/');
                        }
                    });  
                } else {
                    req.session.error = "Nieprawidłowe hasło";
                    res.redirect('/konto/zaloguj');
                }
            }
        });
    });
    
    app.get('/auth/logout', (req, res) => {
        req.logout();
        req.session.message = "Wylogowano pomyślnie";
        res.redirect('/');
    }); 
    
    app.post('/auth/email', async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let confirm_password = req.body.confirm_password;
        
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                req.session.error = 'Nastąpił bład';
                console.log(err);
                redirect('/konto/zarejestruj');
            }
            
            const newUser = await new User({
                contact: { email: email },
                security: { password: hash, verified: false },
                agreements: { rodo_1: true, rodo_2: true }
            }).save();
            
            let id = newUser._id;
            let recipients = [{ email }];
            let subject = `Witamy w serwisie ${Business.name}!`;

            const mailer = new Mailer({ subject, recipients }, require('../services/emailTemplates/verifyEmailTemplate')(id));
            await mailer.send();
            
            req.session.message = "Na podany E-mail została wysłana wiadomość z prośbą o potwierdzenie rejestracji. Jeśli jej nie znajdziesz, sprawdź folder Spam.";
        
            res.redirect('/');
        });
    });
    
    app.get('/auth/email/verify/:id', async (req, res) => {
        let id = req.params.id;
        
        let user = await User.findOne({ _id: ObjectId(id) });
        user.security.verified = true;
        await user.save().then(() => {
            req.session.message = 'E-mail został zatwierdzony. Witamy w serwisie ' + Business.name;
            res.redirect('/');
        }, (err) => {
            req.session.error = "Coś poszło nie tak. Spróbuj ponownie";
            res.redirect('/');
        });
    });
    
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    
    app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['profile', 'email'] }));
    
    app.get('/auth/linkedin', passport.authenticate('linkedin'));

    app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/konto/zaloguj' }));
    
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/konto/zaloguj' }));
    
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/konto/zaloguj' }));
    
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { successRedirect: '/', failureRedirect: '/konto/zaloguj' }));
   
    app.get('/api/logout', (req, res) => {
       req.logout();
       res.redirect('/');
    });
};