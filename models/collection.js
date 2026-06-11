'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {
      Collection.belongsTo(models.User, { as: 'owner', foreignKey: 'user_id' });
      Collection.belongsToMany(models.Publication, {
        through: 'collections_publications',
        as: 'publications',
        foreignKey: 'collection_id',
        otherKey: 'publication_id',
      });
    }
  }
  Collection.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'Collection',
  });
  return Collection;
};
