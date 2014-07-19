var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var FriendSchema = new Schema({
	name: String,
	age: Number
});

module.exports = mongoose.model('Friend', FriendSchema);