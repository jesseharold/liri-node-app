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
        songTitle = "The Sign";
    }
    console.log("spotify: " + songTitle);
    spotify.search({ type: 'track', query: songTitle }, function(error, data) {
        if (error) {
            console.log('Error getting spotify: ' + error);
            return;
        }
        console.log(data);
    });
}

function getMovie(movieTitle){
    if (!movieTitle){
        movieTitle = "Mr. Nobody";
    }
    console.log("movie: " + movieTitle);
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