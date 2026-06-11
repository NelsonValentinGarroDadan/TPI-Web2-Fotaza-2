'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Report.belongsTo(models.Image, { as: 'image', foreignKey: 'image_id' });
      Report.belongsTo(models.Comment, { as: 'comment', foreignKey: 'comment_id' });
    }
  }
  Report.init({
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    image_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Images', key: 'id' },
    },
    comment_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Comments', key: 'id' },
    },
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};
