'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Publication, { as: 'publication', foreignKey: 'publication_id' });
      Image.belongsToMany(models.Tag, {
        through: 'images_tags',
        as: 'tags',
        foreignKey: 'image_id',
        otherKey: 'tag_id',
      });
      Image.hasMany(models.Rating, { as: 'ratings', foreignKey: 'image_id' });
      Image.hasMany(models.Comment, { as: 'comments', foreignKey: 'image_id' });
    }
  }
  Image.init({
    publication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Publications', key: 'id' },
    },
    url: { type: DataTypes.STRING, allowNull: false },
    text_markwater: DataTypes.STRING,
    order_number: { type: DataTypes.INTEGER, allowNull: false },
    license: { type: DataTypes.STRING, allowNull: false, defaultValue: 'sin_copyright' },
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
