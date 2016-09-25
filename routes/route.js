const express = require('express');
const router = express.Router();

const app = require('../app')

app.get('/', function(req, res){
    res.render('index', { title: 'Hey Hey Hey!', message: 'Yo Yo'})
})

router.get('/news', function (req, res, next) {
  res.send('news');
});

router.get('/events', function (req, res, next) {
  res.send('events');
});

module.exports = router;