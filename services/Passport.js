const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const keys = require('../config/keys');


const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types;
const balanceSchema = require('../models/Balance');
require('../models/User');
const Balance = mongoose.model('balance', balanceSchema);

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User
        .findById(id)
        .then(user => {
            done(null, user);
        });
});
     
passport.use(new LinkedInStrategy({
    clientID: keys.linkedinKey,
    clientSecret: keys.linkedinSecret,
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_basicprofile'],
    state: true,
    proxy: true
}, 
async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ auth: { linkedinId: profile.id }});
    let email = typeof profile.emails[0] === 'object' ? profile.emails[0].value : null;
    let link = profile._json.publicProfileUrl;
    
    if (!user && email) {
        user = await User.findOne({ contact: { email: email }});
    }

    if (user) {
        done(null, user);
    } else {
        let newUser = new User({
            auth: { linkedinId: profile.id },
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            contact: { email: email },
            security: { password: null, verified: true },
            agreements: { rodo_1: true, rodo_2: true }
        });
            
        newUser.balance = { balance: new Balance({ _user: newUser._id })};
            
        await newUser.save();
        
        done(null, newUser);
    }
})); 

passport.use(new GoogleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
},
async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ auth: { googleId: profile.id }});
    let email = typeof profile.emails[0] === 'object' ? profile.emails[0].value : null;
    let hasAccount = profile._json.isPlusUser;
    let link = null;
    
    if (hasAccount) {
        link = 'https://plus.google.com/u/0/' + profile.id; 
    }
    
    if (!user && email) {
        user = await User.findOne({ contact: { email: email } });
    }
    
    if (user) {
        done(null, user);
    } else {
        let newUser = new User({
            auth: { googleId: profile.id },
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            contact: { email: email },
            security: { password: null, verified: true },
            agreements: { rodo_1: true, rodo_2: true }
        });
        
        newUser.balance = { balance: new Balance({ _user: newUser._id }) };
        
        await newUser.save();
        
        done(null, newUser);
    }
}));

//passport.use(new FacebookStrategy({
//    clientID: keys.facebookAppId,
//    clientSecret: keys.facebookAppSecret,
//    callbackURL: '/auth/facebook/callback',
//    proxy: true
//},
//async (accessToken, refreshToken, profile, done) => {
//    let user = await User.findOne({ auth: { facebookId: profile.id } });
//    let email = '';
//    let link = '';
//    
//    if (!user && email) {
//        user = await User.findOne({ contact: { email: email } });    
//    }
//    
//    if (user) {
//        done(null, user);
//    } else {
//        let newUser = new User({
//            auth: { facebookId: profile.id },
//            firstName: profile.name.givenName,
//            lastName: profile.name.familyName,
//            contact: { email: email },
//            security: { password: null, verified: true },
//            agreements: { rodo_1: true, rodo_2: true }
//        });
//        
//        newUser.balance = { balance: new Balance({ _user: newUser._id }) };
//        
//        await newUser.save();
//        
//        done(null, newUser);
//    }
//}));

passport.use(new TwitterStrategy({
    consumerKey: keys.twitterAPIKey,
    consumerSecret: keys.twitterAPISecret,
    includeEmail: true,
    proxy: true
},
async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ auth: { twitterId: profile.id }});
    let email = typeof profile.emails[0] === 'object' ? profile.emails[0].value : null;
    let link = 'https://twitter.com/' + profile.username;
    
    if (!user && email) {
        user = await User.findOne({ contact: { email: email }});
    }
    
    if (user) {
        done(null, user)
    } else {
        let newUser = new User({
            auth: { twitterId: profile.id },
            firstName: profile.displayName,
            contact: { email: email },
            security: { password: null, verified: true },
            agreements: { rodo_1: true, rodo_2: true }
        });
        
        newUser.balance = { balance: new Balance({ _user: newUser._id }) };
        
        await newUser.save();
        
        done(null, newUser);
    }
}));

