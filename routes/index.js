
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.agendas = require('./agendas');
exports.bills = require('./bills');
