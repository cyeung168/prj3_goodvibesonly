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

// get root and render index
app.get('/', function(req, res){
  res.render('index.ejs');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});