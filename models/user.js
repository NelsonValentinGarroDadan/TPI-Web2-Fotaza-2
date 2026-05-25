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
      // define association here
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