'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Rating.belongsTo(models.Publication, { as: 'publication', foreignKey: 'publication_id' });
    }
  }
  Rating.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    publication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Publications', key: 'id' },
    },
    score: {
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
