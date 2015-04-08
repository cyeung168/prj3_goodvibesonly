// with express dependency installed — we can set up our server here
// 'requires' look for dependencies in the node_modules folder with that name
require('dotenv').load();
var express = require("express"),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
Twit = require('twit'),
config = require('./config');

// EJS middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// to include css/js/imgs
app.use(express.static(__dirname + '/public'));

// twitter api for userTimeline
var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// get root and render index
app.get('/', function(req, res){
  res.render('index.ejs');
});

// io connection for real-time submit
io.on('connection', function(socket){
  console.log('user connected');

  T.get('users/show', { screen_name: 'wdi16_goodvibes' }, function(err, data, response) {
    // console.log(data);

    createDate = data.status.created_at;
    tweet = data.status.text;

    createDate.split(' ').splice(0,3).join(' ');
    var split = createDate.split(' ');
    var date = split.splice(0,3);
    var year = split[split.length-1];
    date.push(year);
    date = date.join(' ');

    socket.emit('date', date);
    socket.emit('manifest', tweet);
  });

  var stream = T.stream('statuses/filter', { track: ['good vibes', 'positive vibes', 'I\'m grateful'], language: 'en', filter_level: 'low' });
    stream.on('tweet', function (tweet) {
    console.log(tweet.text);
    socket.emit('stream', tweet.text);
  });


  socket.on('manifest response', function(msg){
    io.emit('manifest response', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    stream.stop();
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});