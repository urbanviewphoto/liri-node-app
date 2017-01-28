// LIRI - Language Interpretation & Recognition Interface

// Get command line
var command = process.argv[2];
var object  = process.argv[3];

// console.log('Command:  ' + command);
// console.log('Variable: ' + object);

// First load the fileservice npm to load our Twitter Keys  
var fs = require('fs');
var keys = require('./keys.js');
// for (var key in keys.twitterKeys){
// 	console.log(keys.twitterKeys[key]); 
// }

// Load the request npm to use the OMDBApi
var request = require("request"); 

// Load the table npm for Spotify, etc. 
var Table = require('cli-table');

// Load the Spotify npm to playback any requested song
var spotify = require("spotify");

// Process the command line arguments:
//		do-what-it-says		do the requested action
//      my-tweets			display the last xx number of twitter tweets from my account
//		movie-this			display the entered movie stats from OMDBApi
//		spotify-this-song	play the requested song; if not found, play the default in 
//							random.txt	

function do_action(command, object) {

	switch(command) {
	    case 'do-what-it-says':
	    	// Append to log.txt
	    	fs.appendFile('log.txt', command + '\n');
			// Load the default song
			var default_command = ''; 
			var default_object  = '';
			fs.readFile('random.txt', 'utf8', function(err, data) {
			    var work = data.split(',');
			    default_command = work[0];
			    default_object  = work[1];			     
			    do_action(default_command, default_object); 
			});
	        break;
	    case 'my-tweets':
	        //code block
	        break;
	    case 'movie-this':
	    	if (object == undefined) 
	    		object = "Mr. Nobody";

	    	var queryUrl = "http://www.omdbapi.com/?t=" + object + "&y=&plot=short&r=json";
	    	request(queryUrl, function(error,response,body){
	    		//console.log(JSON.parse(body));

	    		console.log(''); 
	    		fs.appendFile('log.txt', '\n');   		
	    		console.log(command + ' ' + object); 
	    		fs.appendFile('log.txt', command + ' ' + object + '\n');
	    		console.log('-----------------------------------------------');
	    		fs.appendFile('log.txt', '-----------------------------------------------\n');
				console.log('Title:    ' + JSON.parse(body).Title);
				fs.appendFile('log.txt', 'Title:    ' + JSON.parse(body).Title + '\n');
				console.log('Year:     ' + JSON.parse(body).Year);
				fs.appendFile('log.txt', 'Year:     ' + JSON.parse(body).Year + '\n');
				console.log('Rated:    ' + JSON.parse(body).Rated);
				fs.appendFile('log.txt', 'Rated:    ' + JSON.parse(body).Rated + '\n');
				console.log('Country:  ' + JSON.parse(body).Country);
				fs.appendFile('log.txt', 'Country:  ' + JSON.parse(body).Country + '\n');
				console.log('Language: ' + JSON.parse(body).Language);
				fs.appendFile('log.txt', 'Language: ' + JSON.parse(body).Language + '\n');
				console.log('Director: ' + JSON.parse(body).Director);
				fs.appendFile('log.txt', 'Director: ' + JSON.parse(body).Director + '\n');
				console.log('Plot:     ' + JSON.parse(body).Plot);
				fs.appendFile('log.txt', 'Plot:     ' + JSON.parse(body).Plot + '\n');
				console.log('Actors:   ' + JSON.parse(body).Actors);
				fs.appendFile('log.txt', 'Actors:   ' + JSON.parse(body).Actors) + '\n';
				console.log('Rating:   ' + JSON.parse(body).imdbRating);
				fs.appendFile('log.txt', 'Rating:   ' + JSON.parse(body).imdbRating + '\n');
				console.log('Poster:   ' + JSON.parse(body).Poster);
				fs.appendFile('log.txt', 'Poster:   ' + JSON.parse(body).Poster + '\n');
	    		console.log('-----------------------------------------------');	
	    		fs.appendFile('log.txt', '-----------------------------------------------\n');								
			});
	    	break;
	    case 'spotify-this-song':
			if (object == undefined)
				object = "The Sign";

			var objItems = [];
			var objItem  = {}; 
			var objAlbum = [];
			var artists  = []; 
			var album    = '';
			var artist   = '';
			var preview  = ''; 
			var song     = ''; 

			var table = new Table({
	    		  head: 	 ['Song','Album','Artist','Preview'] 
	  			, colWidths: [32, 32, 18, 57]
			});

			var queryUrl = 'https://api.spotify.com/v1/search?type=track&q=' + object + '&limit=10'
			request(queryUrl, function(error,response,body){
				console.log('');
				fs.appendFile('log.txt', '\n'); 
	    		console.log(command + ' ' + object); 
	    		fs.appendFile('log.txt', command + ' ' + object + '\n'); 

	    		objItems = JSON.parse(body).tracks.items; 
	    		for (var i = 0; i<objItems.length; i++){
	    			objItem  = objItems[i]; 
	    			song     = objItem.name;
	    			objAlbum = objItem.album; 
	    			album    = objAlbum.name;  
	    			artists  = objItem.artists;
	    			artist   = artists[0].name; 
	    			preview  = objItem.artists[0].external_urls.spotify;

	    			table.push([song,album,artist,preview]); 

	   				// console.log('Song:    ' + song);    			
	    			// console.log('Album:   ' + album);
	    			// console.log('Artist:  ' + artist);
	    			// console.log('Preview: ' + preview);
	    			// console.log(''); 
	    		}
	    		console.log(table.toString());
	    		fs.appendFile('log.txt', table.toString() + '\n');
			});       		
	    	break;
	}
}

do_action(command, object); 

