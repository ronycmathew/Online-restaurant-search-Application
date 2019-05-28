const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteDishesSchema = new Schema({
	dishID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dishes'
	}
});

const favoriteSchema = new Schema({
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	dishes: [ favoriteDishesSchema ]
	
},{
		timestamps: true
	
});




var Favorites  = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites ;