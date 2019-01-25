const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

require('../../models/User');
require('../../models/Auction');
require('../../models/Chat');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const Chat = mongoose.model('chat');

function account(user) {
    return user.balance.account_number ? 'konto: ' + user.balance.account_number : '';
}

function userDataHelper(user) {
    const   firm    = user.firm && user.firm.firm_name ? `${ user.firm.firm_name }\nNIP: ${ user.firm.nip }` : '',
            name    = `${ user.firstname } ${ user.lastname }`.trim() || 'Anonim',
            address = `${ user.address.street } ${ user.address.postal } ${ user.address.city }`,
            contact = `${ user.contact.email }\n${ user.contact.phone ? 'telefon: ' + user.contact.phone : '' }`;

    return (
        `${ name }\n${ firm }\n${ address }\n${ contact }`
    );
};

async function sendChatMessagesOnAuctionEnd(buyer_id, seller_id, auction, price) {
    const   buyer    = await User.findOne({ _id: buyer_id }),
            seller   = await User.findOne({ _id: seller_id }),
    		_user_1  = buyer._id,
            _user_2  = seller._id,
            _auction = auction._id;

    const   title    = auction.title,
            date     = new Date().getTime();

    const   buyer_text = (
        `Właśnie kupiłem od Ciebie ${ title } za ${ price } zł.\n
        Moje dane:
        ${ userDataHelper(buyer) }`
    );

    const   seller_text = (
        `Wyślę przedmiot, jak dokonasz wpłaty na moje konto. \n
        Moje dane:
        ${ userDataHelper(seller) } \n
        ${ account(seller) }\n
        Pozdrawiam!`
    );

    const chat = await Chat.findOne({ 
        $and: [
            { $or: [ { _user_1 }, { _user_1: _user_2 } ] },
            { $or: [ { _user_2 }, { _user_2: _user_1 } ] }
        ],
        title: { $regex: title, $options: 'i' }
    });

    const   buyer_message   = { date, _from: _user_1, _to: _user_2, title, text: buyer_text, seen: false },
            seller_message  = { date: (date + 10000), _from: _user_2, _to: _user_1, title, text: seller_text, seen: false };

    if (chat) { 
        chat.messages.push(buyer_message);
        chat.messages.push(seller_message);

        chat.save().then(
            doc => { console.log('item bought: new chat messages'); return true },
            err => { console.log(err); return false }
        );
    } else {
        const chat = new Chat({ 
            title,
            date,
            _user_1,
            _user_2,
            _auction,
            messages: [buyer_message, seller_message]
        }).save()
        .then(
            doc => { console.log('new chat created'); return true; }, 
            err => { console.log(err); return false; }
        );
    }
};


module.exports.userDataHelper = userDataHelper;

module.exports.sendChatMessagesOnAuctionEnd = sendChatMessagesOnAuctionEnd;