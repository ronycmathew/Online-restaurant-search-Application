const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
//const Dishes = require('../models/dishes');
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {

//.get(cors.cors, (req,res,next) => {
	Favorites.find({'user':req.user._id})	
	.populate('user')
	.populate('dishes.dishID')
	.then((favorites) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(favorites);
	}, (err) => next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
	
	req.body.user = req.user._id;
	//Favorites.findById(req.user._id)
	//req.body.dishId = req.params.dishId;
	
	Favorites.findOne({'user':req.user._id})
	.then((favorite) => {
		if(favorite == null){
			Favorites.create(req.body)
				.then((favorites) => {
					//favorites.dishes.push(req.body);
					//favorites.save()
					
				
					
					//////////////
						
					req.body.dishID = req.params.dishId;
					favorites.dishes.push(req.body);
					favorites.save();
					
					console.log('Favorites Created', favorites);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorites);
										
					
					
					/////////////
					
				}, (err) => next(err))
			
		}
		else {
				Favorites.findOne({'dishes.dishID':req.params.dishId})
				.then((disfav) => {
					if(disfav == null){
						req.body.dishID = req.params.dishId;
						favorite.dishes.push(req.body);
						favorite.save();
						
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
						
					}
					else {
						err = new Error ('Favorite already exist for ' + req.user._id + '  found!' + req.params.dishId);
						err.status = 404;
						return next(err);
						
						
					}
					
				}, (err) => next(err));
			
				
										
			
			
				
		}
			
		}, (err) => next(err))
	.catch((err) => next(err));
})


.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
	Favorites.remove({'user':req.user._id})	
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
		Favorites.findOne({'user':req.user._id})
		.then((favorites) => {
			if(!favorites){
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				return res.json({"exists": false, "favorites": favorites})
			}
			else {
				if(favorites.dishes.indexOf(req.params.dishId) < 0) {
					//favorite selected dish does not exist
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json({"exists": false, "favorites": favorites})
				}
				else {
					//have correct favorite
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json({"exists": true, "favorites": favorites})
					
				}
			}
				
			
	}, (err) => next(err))
	.catch((err) => next(err));
	
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
	
	req.body.user = req.user._id;
	//Favorites.findById(req.user._id)
	req.body.dishId = req.params.dishId;
	
	Favorites.findOne({'user':req.user._id})
	.then((favorite) => {
		if(favorite == null){
			Favorites.create(req.body)
				.then((favorites) => {
					//favorites.dishes.push(req.body);
					//favorites.save()
					
				
					
					//////////////
						
					req.body.dishID = req.params.dishId;
					favorites.dishes.push(req.body);
					favorites.save();
					
					console.log('Favorites Created', favorites);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorites);
										
					
					
					/////////////
					
				}, (err) => next(err))
			
		}
		else {
				Favorites.findOne({'dishes.dishID':req.params.dishId})
				.then((disfav) => {
					if(disfav == null){
						req.body.dishID = req.params.dishId;
						favorite.dishes.push(req.body);
						favorite.save();
						
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
						
					}
					else {
						err = new Error ('Favorite already exist for ' + req.user._id + '  found!' + req.params.dishId);
						err.status = 404;
						return next(err);
						
						
					}
					
				}, (err) => next(err));
			
				
										
			
			
				
		}
			
		}, (err) => next(err))
	.catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('Put operation not supported!');	
})

.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
	Favorites.find({'user':req.user._id})	
	//Favorites.findById(req.user._id)	
	.then((resp) => {
			if(resp != null ){
				
					//Favorites.update({'user':req.user._id},{$pull: {dishes: {'dishID': req.params.dishId}}},{multi: true});
					//Favorites.update({},{$pull: {dishes: {'dishID': req.params.dishId}}},{multi: true});
					//Favorites.update( { "dishID": req.params.dishId }, { $pull: { "dishID": req.params.dishId}} );
					Favorites.findOneAndUpdate({'user':req.user._id}, {$pull: {dishes: {dishID: req.params.dishId}}}).exec();
		
					
					
				Favorites.find({'user':req.user._id})
				.then((dish) => {
					Favorites.findById(dish._id)
					.populate('user')
					.populate('dishes.dishID')
					.then(() => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					})
					
				}, (err) => next(err));
			
			
		}
		else {
			err = new Error ('Dish ' + req.params.dishId + ' not found!' + req.user._id);
			err.status = 404;
			return next(err);
		}
		
		
		
		
		//res.statusCode = 200;
		//res.setHeader('Content-Type', 'application/json');
		//res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});

/*

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Favorites.find({'user':req.user._id})	
	.then((dish) => {
		if(dish != null){
				dish.dishes._id(req.params.dishId).remove();
				dish.save()
				.then((dish) => {
					Favorites.findById(dish._id)
					//.populate('comments.author')
					.then(() => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					})
					
				}, (err) => next(err));
			
		}
		else if(dish == null){
			err = new Error ('Dish ' + req.params.dishId + ' not found!');
			err.status = 404;
			return next(err);
		}
		
	}, (err) => next(err))
	.catch((err) => next(err));
	
});




.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Favorites.findOne({'dishes.dishID':req.params.dishId})
	//Dishes.findById(req.params.dishId)	
	.then((favdish) => {
		if(favdish != null && favdish.dishes.id(req.params.dishId) != null){
			if (favdish.dishes.id(req.params.dishId).user._id.equals(req.user._id)) {
				favdish.dishes.id(req.params.dishId).remove();
				favdish.save()
				.then((dish) => {
					Favorites.findById(dish._id)
					.populate('user')
					.populate('dishes.dishID')
					.then((dish) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					})
					
				}, (err) => next(err));
			}
			else {
				err = new Error ('Delete not allowed on other users favorite!');
				err.status = 401;
				return next(err);
				
			}
		}
		else if(favdish == null){
			err = new Error ('Favorite ' + req.params.dishId + ' not found!');
			err.status = 404;
			return next(err);
		}
		
	}, (err) => next(err))
	.catch((err) => next(err));
	
});







.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Dishes.findById(req.params.dishId)	
	.then((dish) => {
		if(dish != null && dish.comments.id(req.params.commentId) != null){
			if (dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
				dish.comments.id(req.params.commentId).remove();
				dish.save()
				.then((dish) => {
					Dishes.findById(dish._id)
					.populate('comments.author')
					.then(() => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					})
					
				}, (err) => next(err));
			}
			else {
				err = new Error ('Delete not allowed on other users comments!');
				err.status = 401;
				return next(err);
				
			}
		}
		else if(dish == null){
			err = new Error ('Dish ' + req.params.dishId + ' not found!');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error ('Comment ' + req.params.commentId + ' not found!');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
	
});
*/

module.exports = favoriteRouter;

