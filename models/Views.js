const 
	mongoose 		= require('mongoose'),
	{ Schema } 		= mongoose,
	{ ObjectId } 	= Schema.Types;

const viewSchema = new Schema({
	_auction: ObjectId,
	views: Number
});

mongoose.model('views', viewSchema);