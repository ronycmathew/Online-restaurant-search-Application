const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200', 'http://IE3BLT3VH7N62:3001'];
var corsOptionDelegate = (req, callback) => {
	var corsOptions;
	if(whitelist.indexOf(req.header('origin')) != -1){
		corsOptions = {origin: true};		
	}	
	else {
		corsOptions = {origin: false};
	}
	callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);

