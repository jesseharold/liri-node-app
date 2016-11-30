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
            console.log("Error getting spotify: " + error);
            return;
        }
        var songInfo = data.tracks.items[0];
        console.log("Artist: " + songInfo.artists[0].name);
        console.log("Song Name: " + songInfo.name);
        console.log("Spotify Preview: " + songInfo.preview_url);
        console.log("On Album: " + songInfo.album.name);
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
            console.log("Error getting from OMDB: " + error);
            return;
        }
        var movieInfo = JSON.parse(data.body);
        console.log("Movie Title: " + movieInfo["Title"]);
        console.log("Release Year: " + movieInfo["Year"]);
        console.log("Rated: " + movieInfo["Rated"]);
        console.log("Country of Origin: " + movieInfo["Country"]);
        console.log("Languages: " + movieInfo["Language"]);
        console.log("Plot: " + movieInfo["Plot"]);
        console.log("Actors: " + movieInfo["Actors"]);
        console.log("Rotten Tomatoes Rating: " + movieInfo["tomatoMeter"]);
        console.log("More Info: " + movieInfo["tomatoURL"]);
    })
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
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
            }
        }
    });
}

function readRandomTxt(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            console.log("Error reading random.txt: " + error);
        }
        var randomData = data.split(",");
        var randomCommand = randomData[0];
        var randomArgument = randomData[1];
        chooseCommand(randomCommand, randomArgument);
    });
}