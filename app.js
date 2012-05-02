
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/routes')
  , _ = require('underscore')
  , doses = require('./doses').doses;

var categories = _.uniq(doses.map(function(d) {
    return d.category;
  })).sort()

  , frequencies = _.uniq(doses.map(function(d) {
    return d.frequency;
  })).sort();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
  var top10doses = doses.sort(function(a, b) {
    return a.name.toLowerCase() > b.name.toLowerCase();
  }).slice(0, 10);

  res.render('index', {
    title: 'Drug Dealer',
    categories: categories,
    frequencies: frequencies,
    doses: top10doses
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
