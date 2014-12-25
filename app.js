var express = require('express');
var connection = require('express-myconnection')
var bodyParser = require('body-parser');
var mysql      = require('mysql');

var app = express(); // initialize app
app.use(bodyParser.urlencoded({ extended: false })); // need to add the ability to encode post urls

var dbOptions = mysql.createConnection({
	host     : 'localhost',
	port		 : '3306',
	user     : 'root',
	password : 'pi',
	database : 'url_shadfortner'
});

//app.use( connection(mysql, dbOptions, 'request') ); // connect to DB

app.use(
	connection(mysql,{
		host     : 'localhost',
		port		 : '3306',
		user     : 'root',
		password : 'root',
		database : 'url_shortner'
	},'request')
);//route index, hello world


var routes = require('./routes'); // load in routes - how you modularize


app.set('views', __dirname); //__dirname is the path to the current directory name

app.get('/', function(req, res){  //request and response
	res.render('index.ejs');
});

// the url to redirect to
app.get('/:id', routes.redirectUrl);

app.get('/404', function(req, res){
	res.send("404 message here! You messed up")
}); //404

app.post('/shortenUrl', routes.shortenUrl);

app.listen(8888);
