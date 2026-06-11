'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static associate(models) {
      Publication.belongsTo(models.User, { as: 'author', foreignKey: 'user_id' });
      Publication.hasMany(models.Image, { as: 'images', foreignKey: 'publication_id' });
      Publication.belongsToMany(models.Collection, {
        through: 'collections_publications',
        as: 'collections',
        foreignKey: 'publication_id',
        otherKey: 'collection_id',
      });
    }
  }
  Publication.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    comments_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};
