//globals used in shortenUrl
var count = 0;
// the alphabet used to generate the shortened extensions
var ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

module.exports.redirectUrl = function(req, res){  //request and response

	var shortedUrl = req.params.id;

	//TODO: record anayltics for the user associated with that extension

	req.getConnection(function(err,connection){

		// search for
		connection.query('SELECT * FROM url WHERE id = ?',[1],function(err,rows)     {

			if(err)
				console.log("Error Selecting : %s ",err );

			console.log("REDIRECT SUCCESS");
			console.log(rows[0]);
				//res.render('customers',{page_title:"Customers - Node.js",data:rows});

			var realUrl = rows[0].realUrl; // get the real url
			res.redirect(301, realUrl);

			});

	});

};

module.exports.shortenUrl = function(req, res){

	var userRealUrl = req.body.realUrl; // real url submited by user
	var shortenedUrl = shortenUrl(userRealUrl); // shorten the url

	//TODO: formal the url properly with http://

	var data = {

		realUrl    : userRealUrl,
		shortUrl : "a", // a for now

	};


	req.getConnection(function(err,connection){

		// url table: id, realUrl, shortUrl, custom, customUrl
		connection.query('INSERT INTO url set ?', data,function(err,rows)
		{

			if (err)
				console.log("Error inserting : %s ",err );

			res.redirect('/');

			});

	});

	//TODO: save the shortenedUrl -> realUrl in the db (key -> pair)

	//TODO: respond with a success if url successfully converted with the
	//			matching shortenedUrl -> realUrl pair

};


// convert the last id into base62
function shortenUrl (url)
{

	var num = count;
	var id = "";

	if (num == 0){
		id = ALPHABET[0];
	}
	else{
		while(num > 0)
			{
				var base = parseInt( num / ALPHABET.length ); // make sure int
				var rem = num % ALPHABET.length;
				id = ALPHABET[rem] + id; // remainder alligns with base
				num = base; // reassign num
			}
	}

	count += 1; //increment global count

	return id;

	//TODO: find the avaiable shortest extenstion
	//TODO: increment the overall variable tracking the number to convert
	//TODO: return the shortenedURL
}
