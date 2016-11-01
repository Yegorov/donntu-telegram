const util = require('util');
const express = require('express');
const router = express.Router();
const apiV1 = require('../api/index');
const telegram = require('../telegram/index');
const botApi = telegram.botApi;

var startMessage = "DonNTU News Bot";
var helpMessage = `Доступные команды:
/start
/help
/topNews

Вопросы и пожелания вы можете оставить [тут](https://github.com/yegorov/donntu-telegram/issues) 
`;

var unknownMessage = "Неизвестная команда `¯\\_(ツ)_/¯`";
var errorMessage = "Произошла ошибка";

var commands = {};
// Must be return promise with the message
commands['/start'] = function() {
  return Promise.resolve(startMessage + "\n" + helpMessage);
}
commands['/help'] = function() {
  return Promise.resolve(helpMessage);
}
commands['/topNews'] = function() {
  return apiV1
  .getNewsPromise({offset: 0, limit: 10})
  .then(function(result) {
    var template = "%d. [%s](%s) %s\n"; //1. [title](url) time_from_now
    var content = "";
    result.news.forEach(function(el, i) {
      content += util.format(template, i + 1, el.title, el.url, el.time_from_now);
    });
    return content;
  });
}

// post on https://.../telegram/secretPath
router.post("/" + telegram.secretPath, function(req, res) {
  var r = req.body;
  // Handling only new (incoming) messages
  if (!r.message) {
    return res.sendStatus(200);
  }
  var sequence = Promise.resolve();
  var commandPromise = commands[r.message.text];
  if (commandPromise) {
    sequence = sequence.then(function() {
      return commandPromise();
    }).then(function(content) {
      return Promise.resolve(content);
    }, function(err) {
      console.log("Error in processing: ", err);
      return Promise.resolve(errorMessage);
    });
  }
  else {
    sequence = sequence.then(() => unknownMessage);
  }

  // Send message
  sequence = sequence.then(function(content) {
    return botApi.sendMessage({
      chat_id: r.message.chat.id,
      text: content,
      parse_mode: "Markdown",
    });
  });
  
  // Handle result
  sequence.then(function(data) {
    res.sendStatus(200);
  }).catch(function(err) {
    console.log("Error sending bot: ", err)
    res.sendStatus(200);
  });
});

module.exports = router;
