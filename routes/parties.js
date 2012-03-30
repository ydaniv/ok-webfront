var api = require('./../api');

exports.index = function(req, res){
    api.get('party', '', 'json', function (err, data) {
        if ( err === null ) {
            res.render('party/index.html', data);
        } else {
            throw err;
        }
    });
};

exports.show = function(req, res){
    api.get('party', req.params.id, 'json', function (err, data) {
        if ( err === null ) {
            res.render('party/party.html', data);
        } else {
            throw err;
        }
    });
};