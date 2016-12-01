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
        default:
            console.log("Unknown Command, try one of these: 'spotify-this-song', 'movie-this', 'my-tweets', 'do-what-it-says'");
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
        var outputText = "";
        outputText += "Artist: " + songInfo.artists[0].name + "\n";
        outputText += "Song Name: " + songInfo.name + "\n";
        outputText += "Spotify Preview: " + songInfo.preview_url + "\n";
        outputText += "On Album: " + songInfo.album.name + "\n";
        outputText += "--------------------------\n";
        output(outputText);
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
        v: "1"
    };
    //console.log("movie: " + movieTitle);
    request.get({uri: queryURL, qs: options}, function(error, data){
        if (error){
           console.log("Error getting from OMDB: " + error);
            return;
        }
        if (data.statusCode  !== 200){
            console.log("Response from omdb: " + data.statusCode );
        } else {
            var movieInfo = JSON.parse(data.body);
            var outputText = "";
            outputText += "Movie Title: " + movieInfo["Title"] + "\n";
            outputText += "Release Year: " + movieInfo["Year"] + "\n";
            outputText += "Rated: " + movieInfo["Rated"] + "\n";
            outputText += "Country of Origin: " + movieInfo["Country"] + "\n";
            outputText += "Languages: " + movieInfo["Language"] + "\n";
            outputText += "Plot: " + movieInfo["Plot"] + "\n";
            outputText += "Actors: " + movieInfo["Actors"] + "\n";
            outputText += "Rotten Tomatoes Rating: " + movieInfo["tomatoMeter"] + "\n";
            outputText += "More Info: " + movieInfo["tomatoURL"] + "\n";
            outputText += "--------------------------\n";
            output(outputText);
        }
    });
}

function getTweets(){
    //console.log("getTweets");
    var client = new twitter(keys.twitterKeys);
    var params = {
        screen_name: 'haroldthesquare',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log("Error getting from twitter: " + error);
            return;
        }
        if (response.statusCode !== 200){
            console.log("Response from twitter: " + response.statusCode);
        } else {
            var outputText = "";
            for (var i = 0; i < tweets.length; i++){
                outputText += tweets[i].text + "\n";
                outputText += " - " + tweets[i].created_at + "\n";
            }
            outputText += "--------------------------\n";
            output(outputText);
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

function output(text){
    console.log(text);
    fs.appendFile("log.txt", text + "\n");
}