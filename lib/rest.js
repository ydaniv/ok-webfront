var http = require('http'),
    fs = require('fs');

module.exports = function(app){

  return {
    /**
     * REST API Handler.
     * Receives request path and a callback and executes the request against the OK API Server.
     * If in standalone mode, will work against fixtures
     * @param path - API request path
     * @param callback - request callback
     */
    get: function (path, callback) {

      if (app.enabled('standalone')) {
        path = "fixtures" + path + '.json'
        fs.readFile(path, function (err, context) {
          if (err !== null){
            console.log("read file "+path+" got err "+err);
          } else {
            console.log('got fixture for path ',path);
            callback(null, context);
          }
        });
      }
      else {
        if(path.substr(path.length - 1, 1) !== '/'){
          path += '/';
        }
        var o;
        if (app.enabled('local'))
          o = {
            host: '127.0.0.1',
            port: 8000,
            path: '/api/v2'+path
          }
        else
          o = {
            host: 'api.dev.oknesset.org',
            port: 80,
            path: '/api/v2'+path
          };

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
    }
  }

}
