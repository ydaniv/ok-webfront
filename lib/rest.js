var http = require('http');

exports.get = function(path, callback){
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
        var json = JSON.parse(data.join(''));
        callback(null, json);
      });

    } else {
      callback(new Error('Request to '+path+' returned with status '+res.statusCode));
    }
  });
}