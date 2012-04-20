var http = require('http'),
    app = require('../app'),
    fs = require('fs');

exports.get = function (path, callback) {
  var on_success = function(data) {
  };

  // if (app.enabled('standalone')) {
  if (true) {
    path = "fixtures" + path + '.json'
    fs.readFile(path, function (err, context) {
          if (err !== null)
            console.log("read file "+path+" got err "+err);
          else
            callback(null, context);
        });
  }
  else {
    if(path.substr(path.length - 1, 1) !== '/'){
      path += '/';
    }
    var o = {
      host: 'oknesset.uumpa.com',
      port: 80,
      path: path
    }

    console.log('Got request to', path);
    http.get(o, function(res){
      console.log('Got response from',path,'with status',res.statusCode);
      if(res.statusCode === 200){
        var data = [];
        res.on('data', function(chunk){
          data.push(chunk.toString('UTF-8'));
        });

        res.on('end', function(){
          var context = JSON.parse(data.join(''));
          callback(null, context);
        });

      } else {
        callback(new Error('Request to '+path+' returned with status '+res.statusCode));
      }
    });
  }
};
