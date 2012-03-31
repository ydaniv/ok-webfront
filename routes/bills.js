exports.index = function(req, res){
	var fs = require('fs');
	fs.readFile('fixtures/bill/3133.json', function(err, data) {
		res.render('bill/bill_frame', JSON.parse(data));
	})
}

exports.show = function(req, res){
}