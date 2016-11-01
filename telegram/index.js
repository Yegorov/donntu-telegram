const telegram = require('telegram-bot-api');
const crypto = require('crypto');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Secret url path for Telegram post request
function hashWebhookPath(token) {
  // Double sha256 Hash
  var secretPath = crypto.createHash('sha256')
                         .update("donntu_telegram:" + token + ":yegorov")
                         .digest('hex');
  secretPath = crypto.createHash('sha256')
                     .update(secretPath)
                     .digest('hex');
  return secretPath;
}

var botApi = new telegram({
  token: TOKEN
});

module.exports = {
  botApi: botApi,
  secretPath: hashWebhookPath(TOKEN)
}