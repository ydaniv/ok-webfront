
/**
 * Module dependencies.
 */

var express = require('express')
    , hogan = require('hogan.js')
    , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'mustache');
  app.set('view options',{layout:true});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
    
  // Registering modules

  app.register('mustache', {
    compile: function() {
      var t = hogan.compile.apply(hogan, arguments);
        return function() {
          return t.render.apply(t, arguments);
        }
      }
    });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
