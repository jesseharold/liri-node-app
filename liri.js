var liriCommand = process.argv[2];
var secondArgument = process.argv[3];
var fs = require("fs");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var keys = require("./keys.js");

chooseCommand(liriCommand, secondArgument);

function chooseCommand(command, argument){
    switch (command){
        case "spotify-this-song":
            getSong(argument);
            break;
        case "movie-this":
            getMovie(argument);
            break;
        case "my-tweets":
            getTweets();
            break;
        case "do-what-it-says":
            readRandomTxt();
            break;
    }
}

function getSong(songTitle){
    if (!songTitle){
        //default vlaue
        songTitle = "The Sign Ace of Base";
    }
    //console.log("spotify: " + songTitle);
    spotify.search({ type: "track", query: songTitle, limit: 1 }, function(error, data) {
        if (error) {
           output("Error getting spotify: " + error);
            return;
        }
        var songInfo = data.tracks.items[0];
       output("Artist: " + songInfo.artists[0].name);
       output("Song Name: " + songInfo.name);
       output("Spotify Preview: " + songInfo.preview_url);
       output("On Album: " + songInfo.album.name);
       output("--------------------------");
    });
}

function getMovie(movieTitle){
    if (!movieTitle){
        //default vlaue
        movieTitle = "Mr. Nobody";
    }
    var queryURL = "http://www.omdbapi.com/";
    var options = {
        t: movieTitle, 
        type: "movie", 
        plot: "short", 
        tomatoes: true,
        r: "json", 
        v:"1"
    };
    //console.log("movie: " + movieTitle);
    request.get({uri: queryURL, qs: options}, function(error, data){
        if (error){
           output("Error getting from OMDB: " + error);
            return;
        }
        var movieInfo = JSON.parse(data.body);
       output("Movie Title: " + movieInfo["Title"]);
       output("Release Year: " + movieInfo["Year"]);
       output("Rated: " + movieInfo["Rated"]);
       output("Country of Origin: " + movieInfo["Country"]);
       output("Languages: " + movieInfo["Language"]);
       output("Plot: " + movieInfo["Plot"]);
       output("Actors: " + movieInfo["Actors"]);
       output("Rotten Tomatoes Rating: " + movieInfo["tomatoMeter"]);
       output("More Info: " + movieInfo["tomatoURL"]);
       output("--------------------------");
    });
}

function getTweets(){
    //console.log("getTweets");
    var client = new twitter(keys.twitterKeys);
    var params = {
        screen_name: 'haroldthesquare'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++){
               output(tweets[i].text);
               output(tweets[i].created_at);
            }
            output("--------------------------");
        }
    });
}

function readRandomTxt(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
           output("Error reading random.txt: " + error);
        }
        var randomData = data.split(",");
        var randomCommand = randomData[0];
        var randomArgument = randomData[1];
        chooseCommand(randomCommand, randomArgument);
    });
}

function output(text){
    console.log(text);
    fs.appendFile("log.txt", text + "\n");
}