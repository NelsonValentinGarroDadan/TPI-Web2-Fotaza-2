'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Rating.belongsTo(models.Image, { as: 'image', foreignKey: 'image_id' });
    }
  }
  Rating.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Images', key: 'id' },
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
