'use strict';
module.exports = function(sequelize, DataTypes) {
  var tags_in_news = sequelize.define('tags_in_news', {

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tags_in_news;
};
