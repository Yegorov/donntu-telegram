const grabber = require("./index")
const model = require("../models/index")
const Promise = require('bluebird');

function insertNewsToBD(news) {
    var createTagPromise = function(tagItem, t) {
      return model.tags.findOrCreate({
        where: {
          tag_en: tagItem.tag_en
        },
        defaults: {
          tag_ru: tagItem.tag_ru
        },
        transaction: t
      })
    }

    var foundTags = function(newItem, promiseExternal, t) {
      newItem.tag_items = []
      var sequence = promiseExternal || model.Sequelize.Promise.resolve()

      newItem.tags.forEach(function(tagItem, i) {
        sequence = sequence.then(function() {
          return createTagPromise(tagItem, t)
        }).then(function(tag_item) {
          newItem.tag_items.push(tag_item[0])
        })
      })

      return sequence.then(function() {
        return model.news.findOrCreate({
          where: {
            content_id: newItem.content_id
          },
          defaults: {
            title: newItem.title,
            date_created: newItem.date_created,
            image_url: newItem.image_url,
            count_view: newItem.count_view,
            text_preview: newItem.text_preview,
            text_content: newItem.text_content
          },
          transaction: t
        }).then(function(new_item) {
          if(new_item[1])
            return new_item[0].setTags(newItem.tag_items, {transaction: t})
          return null
        }).then(function() {
          return null
        })
      })
    }

    var newsResolve = function(newItems) {
      return model.sequelize.transaction({autocommit: false },function(t) {
        var sequence = model.Sequelize.Promise.resolve()
        newItems.forEach(function(newItem) {
          sequence = foundTags(newItem, sequence, t).then(function(){})
        })
        return sequence
      }).then(function (result) {
        // Transaction has been committed
        // console.log('Ok', result)
      }).catch(function (err) {
        // Transaction has been rolled back
        console.log('Error in transaction insertNews: ', err)
      });
    }

    return newsResolve(news)
}

function insertEventsToBD(events) {
  return model.sequelize.transaction({autocommit: false}, function(t) {
    var sequence = Promise.resolve()
    events.forEach(function(eventItem){
      sequence = sequence.then(function(){
        return model.events.findOrCreate({
          where: {
            content_id: eventItem.content_id
          },
          defaults: {
            title: eventItem.title,
            date_created: eventItem.date_created
          },
          transaction: t
        })
      })
    })
    return sequence
  }).then(function(result){
    // transaction is commit ok!
  }).catch(function(err){
    console.log("Error in insertEventsToBD: ", err)
  });
}


function grabAndInsertToDB(callback) {
  grabber.grabNews(null, function(arrNews, arrEvents) {
    var promises = []

    arrNews.forEach(function(item) {
      promises.push(new Promise(function(resolve, reject){
        grabber.grabNew(null, function(objNew) {
          //console.log(objNew);
          resolve(objNew)
        }, item);
      }))
    })

    Promise.all(promises)
        .then(function(news){ // [objNew, objNew, ...]
          return insertNewsToBD(news)
        })
        .then(function(){ // [objEvent, objEvent, ...]
          return insertEventsToBD(arrEvents)
        })
        .then(function() {
          callback("ok")
        }, function(err) {
          callback("not ok")
        });
  })
}

module.exports = grabAndInsertToDB;
