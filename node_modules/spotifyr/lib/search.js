'use strict';

const uri = 'https://api.spotify.com/v1/search?q=query&type=querytype';
const request = require('request');

module.exports = function(query, type, cb) {
	const queryStr = query.replace(' ', '+');
	const queryURI = uri.replace('query', queryStr);
	const searchURI = queryURI.replace('querytype', type);

	request(searchURI, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	cb(null, body);
	  } else {
	  	cb(new Error('Bad response'), null);
	  }
	});
}