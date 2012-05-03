
/**
 * Module dependencies.
 */

var express = require('express'),
    _ = require('underscore'),
    doses = require('./doses');

var categories = _.uniq(_.pluck(doses, 'category')).sort(),
    frequencies = _.uniq(_.pluck(doses, 'frequency')).sort();

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
  var top10doses = doses.slice(0, 10);

  res.render('index', {
    categories: categories,
    frequencies: frequencies,
    doses: top10doses
  });
});

app.post('/', function(req, res) {
  var filtered = doses;

  if (req.body.categories) {
    filtered = filtered.filter(function(d) {
      return req.body.categories.indexOf(d.category) != -1;
    });
  }
  if (req.body.frequencies) {
    filtered = filtered.filter(function(d) {
      return req.body.frequencies.indexOf(d.frequency) != -1;
    });
  }
  if (req.body.description) {
    filtered = filtered.filter(function(d) {
      return d.description.indexOf(req.body.description) != -1;
    });
  }

  res.render('index', {
    categories: categories,
    frequencies: frequencies,
    doses: filtered
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
