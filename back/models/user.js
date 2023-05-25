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
    static associate({Project, Wallet, Invests, Donates, Comments, Replies}) {
      // define association here
      this.hasMany(Project, {foreignKey: "userId"})
      this.hasOne(Wallet, {foreignKey: "userId"})
      this.hasMany(Invests, {foreignKey: "userId"})
      this.hasMany(Donates, {foreignKey: "userId"})
      this.hasMany(Comments, {foreignKey: "userId"})
      this.hasMany(Replies, {foreignKey: "userId"})
    }

    toJSON(){
      return { ...this.get(), id: undefined}
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    verified: DataTypes.BOOLEAN,
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    national_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    bio: DataTypes.TEXT('long'),
    id_card_pic: DataTypes.STRING,
    profile_pic: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};