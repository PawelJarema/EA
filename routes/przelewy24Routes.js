const axios = require('axios');
const requireLogin = require('../middleware/requireLogin');
const qs = require('qs');
const md5 = require('md5');
const keys = require('../config/keys');
const business = require('../services/emailTemplates/business');

const P24_DEV = {
	test: 'https://sandbox.przelewy24.pl/testConnection',
	register: 'https://sandbox.przelewy24.pl/trnRegister',
	request: 'https://sandbox.przelewy24.pl/TrnRequest/', //{TOKEN}'
	verify: 'https://sandbox.przelewy24.pl/trnVerify'
}

const prod_url = 'https://secure.przelewy24.pl/testConnection';

module.exports = app => {
	app.post('/przelewy24/ping', requireLogin, async (req, res) => {

		const sign = md5(`${parseInt(keys.przelewy24Id)}|${keys.przelewy24KluczCRC}`);
		const data = {
			'p24_merchant_id': parseInt(keys.przelewy24Id),
			'p24_pos_id': parseInt(keys.przelewy24Id),
			'p24_sign': sign
		};

		const response = await axios.post(P24_DEV.test, qs.stringify(data, { parseArrays: false }));
		console.log(response.data);
	});

	app.post('/przelewy24/registerTransaction', requireLogin, async (req, res) => {
		//const data = req.body;
		
		const crc = keys.przelewy24KluczCRC;

		let data = {
			p24_merchant_id: keys.przelewy24Id,
			p24_pos_id: keys.przelewy24Id,
			p24_session_id: 'session_unique_identifier',
			p24_amount: 123, // /100
			p24_currency: 'PLN',
			p24_description: 'TEST TRANSACTION',
			p24_email: 'pawel.jarema@dd1studio.com', // client email
			p24_country: 'PL',
			p24_url_return: business.host + 'przelewy24/callback',
			p24_api_version: '3.2',
		}
		data['p24_sign'] = md5(`${data.p24_session_id}|${data.p24_merchant_id}|${data.p24_amount}|${data.p24_currency}|${crc}`);

		const response = await axios.post(P24_DEV.register, qs.stringify(data, { parseArrays: false }));
		console.log('register', response.data);
	});

	app.get('/przelewy24/callback', (req, res) => {
		console.log('callback P24');
		res.send({ hello: 'world'});
	});
}