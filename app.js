
/**
 * Module dependencies.
 */

var express = require('express')
    , hulk = require('hulk-hogan')
    , cluster = require('cluster')
    , nconf = require('nconf')
    , lingua = require('lingua');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', hulk);
  app.set('view options',{layout:true});
  app.use(lingua(app, {
    defaultLocale : 'he',
    path          : __dirname + '/i18n'
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
});

function init_dev() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

app.configure('local', function(){
  console.log('** using local oknesset server');
  app.enable('local');
  init_dev();
});

app.configure('standalone', function(){
  console.log('**standalone');
  app.enable('standalone');
  init_dev();
});

app.configure('development', function(){
  console.log('**dev');
  init_dev();
});

app.configure('production', function(){
  console.log('**prod');
  app.use(express.errorHandler());
});

// Routes
var routes = require('./routes')(app);

app.get('/:controller/:action/:id', routes.get);
app.get('/:controller/:id', routes.get);
app.get('/:controller', routes.get);
app.get('/api/v2/*', routes.api);
app.get('/', routes.index);

// Run as cluster (node.js is web scale!)
if (cluster.isMaster) {
  // Fork workers.
  var numCPUs = require('os').cpus().length;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
  console.log("worker: %s", process.env.NODE_WORKER_ID);
  app.listen(nconf.get('port') || 3000);
}
