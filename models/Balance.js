const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const transactionSchema = require('./Transaction');

const balanceSchema = new Schema({
   _user: ObjectId
});

module.exports = balanceSchema;