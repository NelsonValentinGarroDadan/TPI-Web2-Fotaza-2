'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Comment.belongsTo(models.Image, { as: 'image', foreignKey: 'image_id' });
    }
  }
  Comment.init({
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
    content: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
