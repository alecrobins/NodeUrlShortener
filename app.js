var express = require('express');
var connection = require('express-myconnection')
var bodyParser = require('body-parser');
var mysql      = require('mysql');

var app = express(); // initialize app
app.use(bodyParser.urlencoded({ extended: false })); // need to add the ability to encode post urls

// conect to data base
app.use(
	connection(mysql,{
		host     : 'localhost',
		port		 : '3306',
		user     : 'root',
		password : 'root',
		database : 'url_shortner'
	},'request')
);

var routes = require('./routes'); // load in routes - how you modularize

app.set('views', __dirname); //__dirname is the path to the current directory name

app.get('/', function(req, res){  //request and response
	res.render('index.ejs');
});

// the url to redirect to
app.get('/:id', routes.redirectUrl);

app.get('//404', function(req, res){
	res.send("404 message here! You messed up")
}); //404

// when
app.get('//success', routes.success);

app.post('/shortenUrl', routes.shortenUrl);

app.listen(8888);
