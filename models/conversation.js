'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.Image, { as: 'image', foreignKey: 'image_id' });
      Conversation.belongsTo(models.User, { as: 'buyer', foreignKey: 'buyer_id' });
      Conversation.belongsTo(models.User, { as: 'seller', foreignKey: 'seller_id' });
      Conversation.hasMany(models.Message, { as: 'messages', foreignKey: 'conversation_id' });
    }
  }
  Conversation.init({
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Images', key: 'id' },
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
