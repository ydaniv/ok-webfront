exports.index = function(req, res){
    api.get('bill', '', 'json', function (err, data) {
        if ( err === null ) {
            res.render('', data);
        } else {
            throw err;
        }
    });
};

exports.show = function(req, res){

};