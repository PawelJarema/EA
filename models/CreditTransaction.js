const 	mongoose 		= require('mongoose'),
		{ Schema }		= mongoose,
		{ ObjectId }	= mongoose.Types;

const creditTransactionSchema = new Schema({
	date: Number,
	_user: ObjectId,
	p24_session_id: String,
	token: String,
	qty: Number,
	done: { type: Boolean, default: false }
});

mongoose.model('creditTransaction', creditTransactionSchema);