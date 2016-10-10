const util = require('util');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = module.exports = express();
app.use(cookieParser())

const routesMain = require('./routes/index');
const routesTelegram = require('./routes/telegram');

var server = {
    port: 3000,
    host: 'localhost'
};


app.set('env', 'production');

var grabberAdder = require('./grabber/additionToDB')
const model = require("./models/index")
app.get('/test', function (req, res) {
  grabberAdder(function(r) {
    res.send(r)
  })
});

app.use('/', routesMain);
app.use('/telegram', routesTelegram);
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendors',  express.static(__dirname + '/bower_components'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.locals.pretty = true;

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(server.port, function () {
  console.log(util.format('App launch on http://%s:%d', server.host, server.port));
});
