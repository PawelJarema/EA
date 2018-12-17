const 	soap 		= require('soap'),
		axios 		= require('axios'),
		qs 			= require('qs'),
		md5 		= require('md5');

const	keys 		= require('../config/keys');

const 	shopID 		= keys.przelewy24Id,
		pass 		= keys.przelewy24KluczRaportow,

		endpoints 	= {
			'development': `https://sandbox.przelewy24.pl/external/${shopID}.wsdl`,
			'production': `https://secure.przelewy24.pl/external/${shopID}.wsdl`
		},

		root = {
			'development': `https://sandbox.przelewy24.pl/`,
			'production': `https://secure.przelewy24.pl/`
		};

module.exports = function(mode) {
	mode = mode || process.env.NODE_ENV;
	switch (mode) {
		case 'development':
			break;
		case 'production':
			break;
		default:
			mode = 'development';
	}

	function Sign(args) {
		return md5(args.join('|'));
	}

	async function MerchantRegister(merchant) {
		console.log('registering merchant...');
		soap.createClient(
			endpoints[mode],
			(err, client) => {
				const name = `${merchant.firstname || ''} ${merchant.lastname || (merchant.firstname ? '' : 'Anonim')}`;
				const { email, phone } = merchant.contact;

				client.MerchantRegister(
					({
						login: shopID,
						pass,
						MerchantRegisterRequest: {
							business_type: 1,
							name,
							email,
							pesel: merchant.pesel,
							phone_number: phone.replace,
							bank_account: merchant.balance.account_number.replace(/\s/g, ''),
							contact_person: {
								name,
								email,
								phone_number: phone
							},
							address: {
								country: 'PL',
								city: merchant.address.city,
								post_code: merchant.address.postal,
								street: merchant.address.street
							},
							invoice_email: merchant.contact.invoice_email || email,
							services_description: 'Sprzedaż przedmiotów na aukcji internetowej',
							trade: 'aukcje',
							acceptance: true
						}
					}),
					(err, result) => {
						if (err) {
							console.log(err);
						}

						console.log('in soap:', result);
						return result;
					}
				)
			}
		)
	}

	return ({
		
		dispatchTransaction: async transaction => {
			const resp = await MerchantRegister(transaction.seller);

			let data = {
				login: shopID,
				pass,
				batchId: 123456789098,
				details: [
					{ 
						orderId: 99229922,
						sessionId: 'session_id',
						sellerId: 5435435,
						amount: 302,
						title: 'some_title'
					}
				]
			};

			// soap.createClient(
			// 	endpoints[mode],
			// 	(err, client) => {
			// 		client.DispatchTransaction (
			// 			data,
			// 			(err, result) => {
			// 				if (err) {
			// 					console.log(err);
			// 				} else {
			// 					console.log(result);
			// 					return 'OK';
			// 				}
			// 			}
			// 		)
			// 	}
			// );
			return true;
		},

		verifyTransaction: async (data) => {
			const method_name = 'trnVerify';
			const res = await axios.post(
				root[mode] + method_name,
				qs.stringify(data, { parseArrays: false })
			);

			res_arr = res.data.split(/=|&/),
			error = parseInt(res_arr[1]),
			token = res_arr[3] || null;

			if (error || isNaN(error)) {
				console.log('error verifying transaction: ' + error);
				return false;
			} else {
				console.log('verified token: ', token);
				return true;
			}
		},

		requestTransactionUrl: (token) => {
			const method_name = 'trnRequest';
			return `${root[mode]}${method_name}/${token}`;
		},

		registerTransaction: async (data) => {
			const method_name = 'trnRegister';

			data['p24_sign'] = 
				Sign( [ 
					data.p24_session_id,
					data.p24_merchant_id,
					data.p24_amount,
					data.p24_currency,
					keys.przelewy24KluczCRC
				] );

			const res = await axios.post(
				root[mode] + method_name, 
				qs.stringify(data, { parseArrays: false })
			);

			const 	
				res_arr = res.data.split(/=|&/),
				error = parseInt(res_arr[1]),
				token = res_arr[3] || null;


			if (error || isNaN(error)) {
				console.log('error code: ', error);
			} else {
				// console.log('trn token: ', token);
			}
			
			return token;
		},

		testRestAccess: async () => {
			const 	method_name = 'testConnection',
					data 		= {
						'p24_merchant_id': keys.przelewy24Id,
						'p24_pos_id': keys.przelewy24Id,
						'p24_sign': Sign( [ keys.przelewy24Id, keys.przelewy24KluczCRC ] )
			};

			const res = await axios.post(
				root[mode] + method_name, 
				qs.stringify(data, { parseArrays: false })
			);

			console.log('P24 REST: ', res.data);
		},

		testSoapAccess: () => {
			const data = {
				login: shopID,
				pass
			};

			soap.createClient(
				endpoints[mode], (err, client) => {
					client.TestAccess(data, (err, result) => {
						console.log('P24 SOAP: ', result);
					});
				}
			);
		}

	});

};


