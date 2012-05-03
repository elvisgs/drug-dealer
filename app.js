var express = require('express'),
    _       = require('underscore'),
    doses   = require('./doses');

var categories  = _.uniq(_.pluck(doses.all, 'category')).sort(),
    frequencies = _.uniq(_.pluck(doses.all, 'frequency')).sort();

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

var selectionLists = {
  categories: categories,
  frequencies: frequencies
}

app.get('/', function(req, res) {
  var top10doses = doses.all.slice(0, 10);

  res.render('index', _.extend(selectionLists, {
    doses: top10doses
  }));
});

app.post('/', function(req, res) {
  var filtered = doses.find(req.body);

  res.render('index', _.extend(selectionLists, {
    doses: filtered
  }));
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
