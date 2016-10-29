const express = require('express');
const model = require('../models/index');
const moment = require('moment');
const router = express.Router();

moment.locale('ru');

function home(req, res) {
  res.render('index', { 
    title: 'DonNTU News', 
    page: 'home'
  })
}

function news(req, res, next) {
  var offset = parseInt(req.query.offset) || 0;
  var limit = parseInt(req.query.limit) || 5;
  if (limit > 20 || limit < 0) {
      limit = 10;
  }
  if (offset < 0) {
      offset = 0;
  }

  model.sequelize.transaction({autocommit: false}, function(t) {
    var count, rows;
    return model.news.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: { 
        exclude: ['text_content', 'created_at', 'update_at'] 
      },
      order: [['date_created', 'DESC']],
      transaction: t
    }).then(function(result) {
        count = result["count"]
        rows = result["rows"]
        console.log(count);
        
        var array_promises = [];
        rows.forEach(function(row) {
            array_promises.push(row.getTags(
                {
                  attributes: {
                    exclude: ['id', 'created_at', 'update_at']
                  }
                }));
        });
        
        return Promise.all(array_promises).then(function(array_tags){
          //console.log(array_tags);
          return array_tags;
        }).then(function(array_tags) {
            return [count, rows, array_tags]
        }).then(function(res) {
            var newsObj = {};
            newsObj['count'] = res[0];
            newsObj['news'] = []
            res[1].forEach(function(row, i) {
                newsObj['news'].push({
                  id: row.id,
                  title: row.title,
                  url: row.getUrl,
                  text_preview: row.text_preview,
                  image_url: row.image_url,
                  time_from_now: moment(row.date_created).fromNow(),
                  tags: res[2][i].map(function(tag) {
                    return {
                      tag_en: tag.tag_en,
                      tag_ru: tag.tag_ru
                    }
                  })
                })
            });
            return newsObj;
        });
    })
  }).then(function(result){
    // transaction is commit ok!
    res.render('index', { 
      title: 'DonNTU News', 
      page: 'news',
      newsObj: result.news,
      count: result.count,
      prevOffset: offset - limit,
      nextOffset: offset + limit,
      limit: limit
    })
  }).catch(function(err){
    console.log("Error in news: ", err);
    next(new Error(err));
  });
}

function new_by_id(req, res, next) {
    var id = parseInt(req.params.id) || -1;
    if (id == -1) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }
    else {
      model.sequelize.transaction({autocommit: false}, function(t) {
        var foundNew;
        return model.news.findById(id, {
          attributes: { 
            exclude: ['created_at', 'update_at'] 
          },
          transaction: t
        })
        .then(function(row) {
          foundNew = row;
          return row.getTags({
                   attributes: {
                     exclude: ['id', 'created_at', 'update_at']
                   }
                 });
        })
        .then(function(tags){
          return {
            title: foundNew.title,
            text_content: foundNew.text_content.replace(/(?:\r\n|\r|\n)/g, '<br />'),
            url: foundNew.getUrl,
            date: moment(foundNew.date_created).format("dddd, MMMM Do YYYY"),
            tags: tags.map(function(tag) {
                    return {
                      tag_en: tag.tag_en,
                      tag_ru: tag.tag_ru
                    }
                  })
          }
        });
      }).then(function(result){
        //res.send(result);
        res.render('page', result);
      }).catch(function(err){
        console.log("Error in new_by_id: ", err);
        next(new Error(err));
      });
    }
}

function events(req, res, next) {
  var offset = parseInt(req.query.offset) || 0;
  var limit = parseInt(req.query.limit) || 15;
  if (limit > 20 || limit < 0) {
      limit = 10;
  }
  if (offset < 0) {
      offset = 0;
  }
  
  model.sequelize.transaction({autocommit: false}, function(t) {
    return model.events.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [['date_created', 'DESC']],
      transaction: t
    })
    .then(function(res) {
      eventObj = {}
      eventObj.count = res['count'];
      eventObj.events = res['rows'].map(function(row) {
        return {
          date: moment(row.date_created).fromNow(),
          title: row.title,
          url: row.getUrl
        };
      });
      return eventObj;
    });
  })
  .then(function(result){
    res.render('index', { 
      title: 'DonNTU Events', 
      page: 'events',
      events: result.events,
      count: result.count,
      prevOffset: offset - limit,
      nextOffset: offset + limit,
      limit: limit
    });
  })
  .catch(function(err){
    console.log("Error in events: ", err);
    next(new Error(err));
  });
    
    
  //res.render('index', { 
  //  title: 'DonNTU Events', 
  //  page: 'events'
  //})
}
function api(req, res) {
  res.render('index', { 
    title: 'JSON API', 
    page: 'api'
  })
}


router.get('/', home);
router.get('/home', home);
router.get('/news', news);
router.get('/news/:id', new_by_id)
router.get('/events', events);
router.get('/api', api);

module.exports = router;
