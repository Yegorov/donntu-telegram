const express = require('express');
const router = express.Router();

const app = require('../app')

app.get('/', function(req, res){
    console.log(req.cookies)
    var isCookie = !(req.cookies.messageWarning === 'false')
    if (isCookie) {
      res.cookie('messageWarning', false);
    }
    console.log("isCookie " + isCookie)
    res.render('index', { title: 'Hey Hey Hey!', message: 'Yo Yo', messageWarning: isCookie})
})

router.get('/news', function (req, res, next) {
  res.send('news');
});

router.get('/events', function (req, res, next) {
  res.send('events');
});

module.exports = router;
