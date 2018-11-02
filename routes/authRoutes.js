const passport = require('passport');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/User');
const User = mongoose.model('user');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const Mailer = require('../services/Mailer');

module.exports = app => {
    app.post('/auth/login', async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        
        const user = await User.findOne({ contact: { email }});
        
        if (!user) {
            req.session.error = "Nie znaleziono użytkownika";
            res.redirect('/konto/zaloguj');
        }
        
        await bcrypt.compare(password, user.security.password, (err, success) => {
            if (err) {
                req.session.error = err;
                res.redirect('/konto/zaloguj');
            } else {
                if (success) {
                    req.login(user, function(err) {
                        if (err) {
                            req.session.error = err;
                        } else {
                            req.session.message = "Zalogowano pomyślnie";
                            res.redirect('/');
                        }
                    });  
                } else {
                    req.session.error = "Hasła nie zgadzają się";
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
                req.session.error = err;
                redirect('/konto/zarejestruj');
            }
            
            const newUser = await new User({
                contact: { email: email },
                security: { password: hash, verified: false },
                agreements: { rodo_1: true, rodo_2: true }
            }).save();
            
            let id = newUser._id;
            let recipients = [{ email }];
            let subject = "Witamy w serwisie E-Aukcje.pl!";

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
            req.session.message = "E-mail został zatwierdzony. Witamy w serwisie E-Aukcje!";
            res.redirect('/');
        }, (err) => {
            req.session.error = "Coś poszło nie tak. Spróbuj ponownie";
            res.redirect('/');
        });
    });
    
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    app.get('/auth/facebook', passport.authenticate('facebook'));
    
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