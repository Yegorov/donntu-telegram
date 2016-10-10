'use strict';
module.exports = function(sequelize, DataTypes) {
  var events = sequelize.define('events', {
    title: DataTypes.STRING,
    date_created: DataTypes.DATE,
    content_id: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {

      }
    },
    getterMethods: {
      getUrl: function() {
        return util.format("https://donntu.org/news/%s", this.content_id);
      }
    }
  });
  return events;
};
