'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // usuarios que ESTE usuario sigue (lo que cuenta como "seguidos")
      User.belongsToMany(models.User, {
        through: 'Followers',
        as: 'following',
        foreignKey: 'follower_id',
        otherKey: 'followed_id',
      });
      // usuarios que siguen a ESTE usuario (sus "seguidores")
      User.belongsToMany(models.User, {
        through: 'Followers',
        as: 'followers',
        foreignKey: 'followed_id',
        otherKey: 'follower_id',
      });
      User.hasMany(models.Collection, { as: 'collections', foreignKey: 'user_id' });
    }
  }
  User.init({
    nickname: DataTypes.STRING,
    password: DataTypes.STRING,
    biography: DataTypes.STRING,
    profile_img: DataTypes.STRING,
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_admin: {type: DataTypes.BOOLEAN , defaultValue: false}
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};