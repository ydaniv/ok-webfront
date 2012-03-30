exports.index = function(req, res){
	var fs = require('fs');
	fs.readFile('fixtures/agenda/1.json', function(err, data) {
		res.render('agenda/agenda_detail', JSON.parse(data));
	})
}

exports.show = function(req, res){
}