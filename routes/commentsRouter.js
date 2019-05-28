const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Comments = require('../models/comments');

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
	Comments.find(req.query)	
	.populate('author')
	.then((comments) => {		
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(comments);	
	}, (err) => next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	if(req.body != null){
		req.body.author = req.user._id;
		Comments.create(req.body)
		.then((comment) => {
			Comments.findById(comment._id)
			.populate('author')
			.then((comment) =>{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(comment);
			})
		
			
		}, (err) => next(err))
		.catch((err) => next(err));
	}
	else {
		err = new Error('Comment not found in the request body');
		err.status = 404;
		return next(err);
	}
	
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('Put operation not supported on /Comments/');	
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
	Comments.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
		
	}, (err) => next(err))
	.catch((err) => next(err));
});


commentRouter.route('/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
	Comments.findById(req.params.commentId)
	.populate('author')
	.then((comment) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(comment);	
		
	}, (err) => next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	res.statusCode = 403;
	res.end('POST Operation not supported on /comment/' + req.params.commentId);	
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Comments.findById(req.params.commentId)
	.then((comment) => {
		if(comment != null){
			//if(dish.comments.id(req.params.commentId).author._id === req.user._id){
			if (comment.author.equals(req.user._id)) {
				
				var err = new Error ('You are not authorized to update other comments!' );
				err.status = 403;
				return next(err);
			}
				
			req.body.author = req.user._id;
			Comments.findByIdAndUpdate(req.params.commentId, {
				$set: req.body
			}, {new: true})
			.then((comment) => {
				Comments.findById(comment._id)
				.populate('author')
				.then((comment) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(commentx);
				})
				
			}, (err) => next(err));
			
					
		}
		else {
			err = new Error ('Comment ' + req.params.commentId + ' not found!');
			err.status = 404;
			return next(err);
		}
		
	}, (err) => next(err))
	.catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Comments.findById(req.params.commentId)	
	.then((comment) => {
		if(comment != null){
			//if (dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
				if(!comment.author.equals(req.user._id)){
				var err = new Error ('Delete not allowed on other users comments!');
				err.status = 403;
				return next(err);
				
			}
			
				//dish.comments.id(req.params.commentId).remove();
				Comments.findByIdAndRemove(req.params.commentId)
				dish.save()
				.then((resp) => {
					
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(resp);
					
					
				}, (err) => next(err));
				.catch((err) => next(err));
				
			
		}
		else {
			err = new Error ('Comment ' + req.params.commentId + ' not found!');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
	
});


module.exports = commentRouter;
