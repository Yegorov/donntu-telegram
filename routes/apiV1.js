const express = require('express');
const router = express.Router();
const apiV1 = require('../api/index');

const JSON_SPACE = 2;

router.get('/getNews', function(req, res) {
  var offset = parseInt(req.query.offset) || 0;
  var limit = parseInt(req.query.limit) || 5;
  if (limit > 20 || limit < 0) {
      limit = 10;
  }
  if (offset < 0) {
      offset = 0;
  }
  
  res.setHeader('Content-Type', 'application/json');
  
  apiV1.getNewsPromise({offset: offset, limit: limit})
  .then(function(result){
    //console.log(result);
    res.send(JSON.stringify({
      status: 'OK',
      response: result,
    }, null, JSON_SPACE));
  }).catch(function(err){
    console.log(err);
    res.send(JSON.stringify({
      status: 'ERROR',
      description: err.toString(),
    }, null, JSON_SPACE));
  })
})

router.get('/getEvents', function(req, res) {
  var offset = parseInt(req.query.offset) || 0;
  var limit = parseInt(req.query.limit) || 15;
  if (limit > 20 || limit < 0) {
      limit = 10;
  }
  if (offset < 0) {
      offset = 0;
  }
  
  res.setHeader('Content-Type', 'application/json');
  
  apiV1.getEventsPromise({offset: offset, limit: limit})
  .then(function(result){
    //console.log(result);
    res.send(JSON.stringify({
      status: 'OK',
      response: result,
    }, null, JSON_SPACE));
  }).catch(function(err){
    console.log(err);
    res.send(JSON.stringify({
      status: 'ERROR',
      description: err.toString(),
    }, null, JSON_SPACE));
  }) 
})

router.get('/getNew', function(req, res) {
  var id = parseInt(req.query.id) || -1;
  res.setHeader('Content-Type', 'application/json');
  apiV1.getNewByIdPromise({id: id})
  .then(function(result){
    //console.log(result);
    res.send(JSON.stringify({
      status: 'OK',
      response: result,
    }, null, JSON_SPACE));
  }).catch(function(err){
    console.log(err);
    res.send(JSON.stringify({
      status: 'ERROR',
      description: err.toString(),
    }, null, JSON_SPACE));
  })
})

module.exports = router;