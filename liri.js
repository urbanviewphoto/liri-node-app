// LIRI - Language Interpretation & Recognition Interface

// Get command line
var command = process.argv[2];
var object  = process.argv[3];

// console.log('Command:  ' + command);
// console.log('Variable: ' + object);

// First load the fileservice npm to load our Twitter Keys  
var fs = require('fs');
var keys = require('./keys.js');
//console.log(twitterKeys.consumer_key); 
// for (var key in keys.twitterKeys){
// 	console.log(keys.twitterKeys[key]); 
// }

// Load the request npm to use the OMDBApi
var request = require("request"); 

// Load the table npm for Spotify, etc. 
var Table = require('cli-table');

// Load the Twitter request npm for Twitter access
var Twitter = require('twitter');

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

			var tweetID   = '';
			var tweetDate = ''; 
			var tweetText = '';
			var tweetUrls = []; 
			var tweetUrl  = '';

			var table = new Table({
	    		  head: 	 ['ID','Date','URL','Text'] 
	  			, colWidths: [20, 32, 32, 62]
			});	    
			var client = new Twitter(keys.twitterKeys); 			 
			var params = {screen_name: 'urbanviewphoto'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (!error) {
					console.log('');
					fs.appendFile('log.txt', '\n'); 
	    			console.log(command); 
	    			fs.appendFile('log.txt', command + '\n'); 					
					for (var i=0; i<tweets.length; i++){
						 tweet = tweets[i];
						 tweetID   = tweet.id;
						 tweetDate = tweet.created_at;
						 tweetText = tweet.text;						 
						 tweetUrls = tweet.entities.urls; 
						 if (tweetUrls.length>0)
						 	tweetUrl = tweetUrls[0].display_url;
						 else 
							tweetUrl = '';
						 //console.log(pad(tweetText,62,'right'));
						 table.push([tweetID,tweetDate,tweetUrl,
						 			 pad(tweetText,62,'right')]);
					}
					console.log(table.toString());
	    			fs.appendFile('log.txt', table.toString() + '\n');
			  }
			});

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
		    	fs.appendFile('log.txt', command + ' 		' + object + '\n');	

				var table = new Table({
		    		  head: 	 ['Movie Info',' '] 
		  			, colWidths: [12, 102]
				});	   

				var mTitle    = JSON.parse(body).Title;
				var mYear     = JSON.parse(body).Year;
				var	mRated    = JSON.parse(body).Rated;
				var mCountry  = JSON.parse(body).Country;
				var mLanguage = JSON.parse(body).Language;
				var mDirector = JSON.parse(body).Director;
				var mPlot     = JSON.parse(body).Plot; 	
				var mActors   = JSON.parse(body).Actors;
				var mRating   = JSON.parse(body).imdbRating;
				var mPoster   = JSON.parse(body).Poster;			       	    	 

				table.push(['Title:    ',pad(mTitle,62,'right')]);
				table.push(['Year:     ',pad(mYear,62,'right')]);
				table.push(['Rated:    ',pad(mRated,62,'right')]);
				table.push(['Country:  ',pad(mCountry,62,'right')]);
				table.push(['Language: ',pad(mLanguage,62,'right')]);
				table.push(['Director: ',pad(mDirector,62,'right')]);

				var result = wordWrapToStringList(mPlot,60);
				for (var i=0; i<result.length; i++){
					if (i == 0)
						var mLabel='Plot:     ';
					else 
						mLabel = '          ';
					table.push([mLabel,result[i]]); 				
				}

				table.push(['Actors:   ',pad(mActors,62,'right')]);	
				table.push(['Rating:   ',pad(mRating,62,'right')]);	
				table.push(['Poster:   ',pad(mPoster,62,'right')]);	
	    		console.log(table.toString());
	    		fs.appendFile('log.txt', table.toString() + '\n');			
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

function pad(string,len,side){
	if (string.length<len){
		var spaces  = '';
		var padding = len-string.length;
		for (var i=0; i<padding; i++){
			spaces+=' ';
		}
		if (side == 'right')
			string+=spaces;
		else 
			string = spaces + string;	
	}
	return string; 
}

function wordWrapToStringList (text, maxLength) {
	var result = [];
    var line = [];
    var length = 0;
    text.split(" ").forEach(function(word) {
        if ((length + word.length) >= maxLength) {
            result.push(line.join(" "));
            line = []; length = 0;
        }
        length += word.length + 1;
        line.push(word);
    });
    if (line.length > 0) {
        result.push(line.join(" "));
    }
    return result;
};


do_action(command, object); 

