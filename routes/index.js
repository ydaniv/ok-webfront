module.exports = function(app) {

  var rest = require('./../lib/rest')(app);

  return {
    /*
     * GET home page.
     */
    index: function(req, res){
      res.render('index', { title: 'Express' })
    },
    /**
     * Route globbing function for GET requests.
     * Expects routes in format:
     *  GET /:controller
     *  GET /:controller/:id
     *  GET /:controller/:action/:id
     * Proxies request to rest API on oknesset and renders the relevant view accordingly
     * @param req
     * @param res
     */
    api: function(req, res, next){
        console.log('LOG: API call to ', req.params.path);
        rest.get(req.path.substr(7), function(err, data){
              res.send(data)
        })
    },
    get: function(req, res, next){
      var controller = req.params.controller,
      id = req.params.id,
      action = req.params.action || (id ? 'show' : 'index');

      if(~req.path.indexOf('css') || ~req.path.indexOf('txt') ||
         ~req.path.indexOf('js') || ~req.path.indexOf('img')){
        next();
      } else {
        rest.get(req.path, function(err, data){
          if ( err === null )
              res.render(controller + '/' + action + '.html', data)
          else {
            console.log('ERROR', err, req.path);
            res.end(null);
          }
        });
      }
    }
  }

};
