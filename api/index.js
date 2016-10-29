const model = require('../models/index');
const moment = require('moment');

moment.locale('ru');

function getNewsPromise(options) {
  options = options || {};
  var offset = options.offset || 0;
  var limit = options.limit || 5;
  return model.sequelize.transaction({autocommit: false}, function(t) {
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
    //console.log(result.news);
    return { 
      news: result.news,
      count: result.count,
      prevOffset: offset - limit,
      nextOffset: offset + limit,
      limit: limit
    };
  });
}

function getEventsPromise(options) {
  options = options || {};
  var offset = options.offset;
  var limit = options.limit;
  return model.sequelize.transaction({autocommit: false}, function(t) {
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
          date: moment(row.date_created).format("dddd, MMMM YYYY"),
          title: row.title,
          url: row.getUrl
        };
      });
      return eventObj;
    });
  })
  .then(function(result){
    return { 
      events: result.events,
      count: result.count,
      prevOffset: offset - limit,
      nextOffset: offset + limit,
      limit: limit
    };
  });
}

function getNewByIdPromise(options) {
  options = options || {};
  console.log(options);
  var id = parseInt(options.id) || -1;
  if(id == -1)
      return Promise.reject(new Error("Bad id"));
  
  return model.sequelize.transaction({autocommit: false}, function(t) {
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
            text_content: foundNew.text_content,
            url: foundNew.getUrl,
            date: moment(foundNew.date_created).format("dddd, MMMM YYYY"),
            tags: tags.map(function(tag) {
                    return {
                      tag_en: tag.tag_en,
                      tag_ru: tag.tag_ru
                    }
                  })
          }
        });
      })
      .then(function(result){
        var obj = {};
        obj['new'] = result;
        return obj;
      });  
    
}

module.exports = {
  getNewsPromise: getNewsPromise,
  getEventsPromise: getEventsPromise,
  getNewByIdPromise: getNewByIdPromise
}