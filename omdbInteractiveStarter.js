// INSTRUCTIONS:
// ---------------------------------------------------------------------------------------------------------
// Level 1:
// Take any movie with a word title (ex: Cinderella) as a Node argument and retrieve the year it was created

// Level 2 (More Challenging):
// Take a move with multiple words (ex: Forrest Gump) as a Node argument and retrieve the year it was created.
// ---------------------------------------------------------------------------------------------------------

var request = require("request"); 

var movieName = process.argv[2];

// Grab or assemble the movie name and store it in a variable called "movieName"
//var movieName = "Star Wars";
// ...


// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";


// This line is just to help us debug against the actual URL.
console.log(queryUrl);


// Then create a request to the queryUrl
// ...
request(queryUrl, function(error,response,body){
	console.log(JSON.parse(body).Released);
});

  // If the request is successful
  // ...


  // Then log the Release Year for the movie
  // ...
