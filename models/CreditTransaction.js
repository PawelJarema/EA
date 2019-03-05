const 	mongoose 		= require('mongoose'),
		{ Schema }		= mongoose,
		{ ObjectId }	= Schema.Types;

const creditTransactionSchema = new Schema({
	date: Number,
	_user: ObjectId,
	_auction: ObjectId,
	promoCode: Number,
	p24_session_id: String,
	token: String,
	qty: Number,
	done: { type: Boolean, default: false }
});

mongoose.model('creditTransaction', creditTransactionSchema);