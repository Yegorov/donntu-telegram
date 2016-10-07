const express = require('express');
const model = require('../models/index');
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
  //res.send('events');
  var arrTags = ['tag1', 'tag3', 'tag5', 'tag7'];
  var createPromises = function(arrTags) {
    var arrPromise = []
    arrTags.forEach(function(el, i, arr){
      arrPromise.push(model.tags.findOrCreate({
                        where: {
                          tag: el
                        }
                      }));
    });
    return arrPromise;
  }

  Promise.all(createPromises(arrTags))
         .then(function(arrs){
           res.setHeader('Content-Type', 'application/json');
           res.send(JSON.stringify(arrs.map((i) => i[0]['tag']), null, 4));
           //res.json(arrs.map((i) => i[0]), null, 4);
         }).catch(function(err){
           res.send(err);
         })
});

router.get('/tags/json', (req, res) => {
  var limit = parseInt(req.query.limit) || 20;
  var space = parseInt(req.query.space) || 4;
  model.tags.findAll({ limit: limit }).then((tags) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(tags, null, space));
  }).catch((err) => {res.send(err)});
});

module.exports = router;
