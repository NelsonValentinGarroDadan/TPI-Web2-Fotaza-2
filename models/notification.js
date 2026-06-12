'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { as: 'recipient', foreignKey: 'user_id' });
      Notification.belongsTo(models.User, { as: 'actor', foreignKey: 'actor_id' });
      Notification.belongsTo(models.Image, { as: 'image', foreignKey: 'image_id' });
    }
  }
  Notification.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Images', key: 'id' },
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};
