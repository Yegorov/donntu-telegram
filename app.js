const util = require('util');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = module.exports = express();

const routesMain = require('./routes/index');
const routesTelegram = require('./routes/telegram');
const routesAPI_v1 = require('./routes/apiV1');

const telegram = require('./telegram/index');

var bot_enable = typeof(process.env.TELEGRAM_BOT_TOKEN) !== "undefined" && 
                 process.env.TELEGRAM_BOT_TOKEN !== null;

var server = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
};

app.set('env', server.env);
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(bodyParser.json()); 

app.use('/', routesMain);
app.use('/telegram', routesTelegram);
app.use('/api/v1', routesAPI_v1);


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

// Set up Telegram bot
if (bot_enable) {
  var sequence = Promise.resolve();
  
  // 1. Set webHook URL, see https://core.telegram.org/bots/api#setwebhook
  sequence = sequence.then(function() {
    return telegram.botApi.setWebhook({
      url: util.format("https://%s/telegram/%s", 
                       server.host, telegram.secretPath)
    });
  });

  // 2. Get result
  sequence = sequence.then(function(webHookInfo) {
    console.log(util.format("Webhook URL: %s", 
                            webHookInfo.url));
    console.log(util.format("Number of updates awaiting delivery: %s", 
                            webHookInfo.pending_update_count));
    
    // can add other info for output in log,
    // see https://core.telegram.org/bots/api#webhookinfo
  });

  // 3. Test bot, get info about self
  sequence = sequence.then(function() {
    return telegram.botApi.getMe()
    .then(function(userInfo) {
      console.log(util.format("Telegram Bot %s strting...", userInfo.first_name));
    })
  });

  // 4. Catch Error
  sequence.catch(function(err) {
    console.log("Error when starting the bot:", err);
  });
}