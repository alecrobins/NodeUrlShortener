//globals used in shortenUrl
var count = 0;
// the alphabet used to generate the shortened extensions
var ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

module.exports.redirectUrl = function(req, res){  //request and response

	var shortenUrl = req.params.id;
	//TODO: record anayltics for the user associated with that extension

	req.getConnection(function(err,connection){

		var usrId = base62ToId(shortenUrl); //convert the passed id

		// search for
		connection.query('SELECT * FROM url WHERE id = ?', [usrId], function(err,rows)     {

			if(err)
				console.log("Error Selecting : %s ",err );

			if(rows[0] != null){
				var realUrl = rows[0].realUrl; // get the real url
				res.redirect(301, "http://" + realUrl);
			}
			else {
					//TODO: need to handle urls that don't exist by passing to a 404
					console.log("404: YOU DON'T EXIST");
					res.redirect('/');
			}

		}); // end of function

	}); // end of query

};

module.exports.shortenUrl = function(req, res){

	var userRealUrl = req.body.realUrl; // real url submited by user
	//TODO: formal the url properly with http://

	req.getConnection(function(err,connection){

		//get the last id added
		connection.query('SELECT id FROM url ORDER BY id DESC LIMIT 1', function(err,rows){

			var lastId = rows[0].id + 1; // one past the last inserted url
			var shortenedUrl = idToBase62(lastId).toString();


			// data that will be saved
			var data = {
				realUrl    : userRealUrl,
				shortUrl 	 : shortenedUrl,
			};

				// add the new url to the db
				// url table: id, realUrl, shortUrl, custom, customUrl
				connection.query('INSERT INTO url set ?', data,function(err,rows)
				{

					if (err)
						console.log("Error inserting : %s ",err );

						//TODO: redirect to success page
						res.redirect('/');

				});

		});

	});

	//TODO: respond with a success if url successfully converted with the
	//			matching shortenedUrl -> realUrl pair

};


// convert the last id into base62
function idToBase62 (id)
{
	console.log("ID: " + id);
	var num = id; //TODO: set to one past the last element added
	var ext = "";

	if (num == 0){
		ext = ALPHABET[0];
	}
	else{
		while(num > 0)
			{
				var base = parseInt( num / ALPHABET.length ); // make sure int
				var rem = num % ALPHABET.length;
				ext = ALPHABET[rem] + ext; // remainder alligns with base
				num = base; // reassign num
			}
	}

	return ext;
}

// convert from base 62 into an id
function base62ToId (baseNum)
{
	// convert base62 to base10 : k9b = 10*62^2 + 61*62^1 + 1*62^ 0
	var exponent = baseNum.length - 1;
	var stringNum = baseNum;

	var id = 0;

	while(exponent >= 0)
	{
		var num = parseInt( ALPHABET.indexOf(stringNum[0])); //get the num equivalent
		id += num * Math.pow(62,exponent); // 62 ^ exponent

		exponent -= 1;
		stringNum = stringNum.substring(1); //remove first character
	}

	return id;

}
