'use strict';
module.exports = function(sequelize, DataTypes) {
  var tags = sequelize.define('tags', {
    tag_ru: {
      type: DataTypes.STRING,
      unique: true
    },
    tag_en: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        tags.belongsToMany(models.news,
          {
            through: {
              model: models.tags_in_news
            },
            foreignKey: 'tags_id'
          });
        }
     }
  });
  return tags;
};
