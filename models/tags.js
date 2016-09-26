'use strict';
module.exports = function(sequelize, DataTypes) {
  var tags = sequelize.define('tags', {
    tag: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        tags.belongsToMany(models.news,
          {
            through: {
              model: models.tags_in_news
            },
            foreignKey: 'tag_id'
          });
        }
     }
  });
  return tags;
};
