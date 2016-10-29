const util = require('util');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = module.exports = express();

const routesMain = require('./routes/index');
const routesTelegram = require('./routes/telegram');
const routesAPI_v1 = require('./routes/apiV1');

var server = {
    port: 3000,
    host: 'localhost',
    env: 'development1'
};

app.set('env', server.env);
app.set('view engine', 'pug');

app.use(cookieParser());

app.use('/', routesMain);
app.use('/telegram', routesTelegram);
app.use('/api/v1', routesAPI_v1)

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendors',  express.static(__dirname + '/bower_components'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.locals.pretty = true; // for pretty html in page

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
    //error: {}
  });
});


app.listen(server.port, function () {
  console.log(util.format('App launch on http://%s:%d', server.host, server.port));
});
