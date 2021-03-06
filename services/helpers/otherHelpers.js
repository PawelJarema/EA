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

function userFirmHelper(user) {
    return user.firm && user.firm.firm_name ? `${ user.firm.firm_name }\nNIP: ${ user.firm.nip }` : '';
}

function userNameHelper(user) {
    return `${ user.firstname } ${ user.lastname }`.trim() || 'Anonim';
}

function userAddressHelper(user) {
    return `${ user.address.street } ${ user.address.postal } ${ user.address.city }`;
}

function userContactHelper(user) {
    return `${ user.contact.email }\n${ user.contact.phone ? 'telefon: ' + user.contact.phone : '' }`
}

function userDataHelper(user) {
    const   firm    = userFirmHelper(user),
            name    = userNameHelper(user),
            address = userAddressHelper(user),
            contact = userContactHelper(user);

    return (
        `${ name }\n${ firm }\n${ address }\n${ contact }`
    );
};

async function sendChatMessages(buyer_id, seller_id, auction, price, buyer_text, seller_text) {
    const 
        _user_1  = ObjectId(buyer_id),
        _user_2  = ObjectId(seller_id),
        _auction = auction._id,
        date     = Date.now();

    const 
        chat = await Chat.findOne({ 
            $and: [
                { $or: [ { _user_1 }, { _user_1: _user_2 } ] },
                { $or: [ { _user_2 }, { _user_2: _user_1 } ] }
            ],
            title: { $regex: auction.title, $options: 'i' }
        });

    const   
        buyer_message   = buyer_text ? { date, _from: _user_1, _to: _user_2, title: auction.title, text: buyer_text, seen: false } : null,
        seller_message  = seller_text ? { date: (date + 10000), _from: _user_2, _to: _user_1, title: auction.title, text: seller_text, seen: false } : null;

    if (chat) { 
        if (buyer_message) chat.messages.push(buyer_message);
        if (seller_message) chat.messages.push(seller_message);

        chat.save().then(
            doc => { console.log('item bought: new chat messages'); return true },
            err => { console.log(err); return false }
        );
    } else {
        const messages = buyer_message && seller_message ? [buyer_message, seller_message] : buyer_message ? [buyer_message] : seller_message ? [seller_message] : null;
        if (!messages) return;

        const chat = new Chat({ 
            title: auction.title,
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
}

async function sendChatMessagesOnAuctionEnd(buyer_id, seller_id, auction, price) {
    const   
        buyer  = await User.findOne({ _id: buyer_id }),
        seller = await User.findOne({ _id: seller_id }),
        title = auction.title;

    const buyer_text = (
        `Właśnie kupiłem od Ciebie ${ title } za ${ price } zł.\n
        Moje dane:
        ${ userDataHelper(buyer) }`
    );

    const seller_text = (
        `Wyślę przedmiot, jak dokonasz wpłaty na moje konto. \n
        Moje dane:
        ${ userDataHelper(seller) } \n
        ${ account(seller) }\n
        Pozdrawiam!`
    );

    sendChatMessages(buyer_id, seller_id, auction, price, buyer_text, seller_text);
};

async function sendChatMessagesOnPay(buyer_id, seller_id, auction, price, qty, shipping_method) {
    const buyer_text = (
        `Wpłaciłem ${ price } zł na zakup ${ auction.title }\n(${qty} szt.)\n
         Na metodę dostawy wybrałem ${ shipping_method }.\n
         Pieniądze powinny dotrzeć za jakiś czas. Koniecznie sprawdź, czy pieniądze dotarły, a potem wyślij ${ (qty > 1 ? 'przedmioty' : 'przedmiot') }.`
    );

    sendChatMessages(buyer_id, seller_id, auction, price, buyer_text, null);
}

async function sendChatMessageOnItemSend(buyer_id, seller_id, auction, price, qty) {
    const seller_text = (
        `Wysłałem do Ciebie ${ qty > 1 ? ('zakupione przedmioty (' + qty + ' szt.)') : 'zakupiony przedmiot' } ${ auction.title }.`
    );

    sendChatMessages(buyer_id, seller_id, auction, price, null, seller_text);
} 

module.exports.sendChatMessageOnItemSend = sendChatMessageOnItemSend;
module.exports.userNameHelper = userNameHelper;
module.exports.userFirmHelper = userFirmHelper;
module.exports.userAddressHelper = userAddressHelper;
module.exports.userContactHelper = userContactHelper;
module.exports.userDataHelper = userDataHelper;
module.exports.sendChatMessagesOnPay = sendChatMessagesOnPay;
module.exports.sendChatMessagesOnAuctionEnd = sendChatMessagesOnAuctionEnd;