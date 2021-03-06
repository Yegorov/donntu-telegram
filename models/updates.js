'use strict';
module.exports = function(sequelize, DataTypes) {
  var updates = sequelize.define('updates', {
    date_update: DataTypes.DATE
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return updates;
};
