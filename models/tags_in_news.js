'use strict';
module.exports = function(sequelize, DataTypes) {
  var tags_in_news = sequelize.define('tags_in_news', {
    news_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'news',
        key: 'id'
      }
    },
    tags_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'tags',
          key: 'id'
        }
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tags_in_news;
};
