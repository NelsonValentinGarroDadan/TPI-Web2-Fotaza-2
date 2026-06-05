'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Image, {
        through: 'images_tags',
        as: 'images',
        foreignKey: 'tag_id',
        otherKey: 'image_id',
      });
    }
  }
  Tag.init({
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};
