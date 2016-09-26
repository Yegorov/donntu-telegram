'use strict';
const util =  require('util');
module.exports = function(sequelize, DataTypes) {
  var news = sequelize.define('news', {
    title: DataTypes.STRING,
    date_created: DataTypes.DATE,
    content_id: DataTypes.STRING,
    text_preview: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        news.belongsToMany(models.tags,
          {
            through: {
              model: models.tags_in_news
            },
            foreignKey: 'news_id'
          });
      },
    },
    getterMethods: {
      getUrl: function() {
        return util.format("https://donntu.org/news/%s", this.content_id);
      }
    },
  });
  return news;
};
