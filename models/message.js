'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { as: 'conversation', foreignKey: 'conversation_id' });
      Message.belongsTo(models.User, { as: 'sender', foreignKey: 'sender_id' });
      Message.belongsTo(models.Image, { as: 'image', foreignKey: 'image_id' });
    }
  }
  Message.init({
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Conversations', key: 'id' },
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Images', key: 'id' },
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
