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
    static associate({Project, Wallet, Invest, Donate, Comment, Reply, Like, BannedUser}) {
      // define association here
      this.hasMany(Project, {foreignKey: "userId"})
      this.hasOne(Wallet, {foreignKey: "userId"})
      this.hasOne(BannedUser, {foreignKey: "userId"})
      this.hasMany(Invest, {foreignKey: "userId"})
      this.hasMany(Donate, {foreignKey: "userId"})
      this.hasMany(Comment, {foreignKey: "userId"})
      this.hasMany(Reply, {foreignKey: "userId"})
      this.hasMany(Like, {foreignKey: "userId"})
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    verified: DataTypes.BOOLEAN,
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    bio: DataTypes.TEXT('long'),
    idCardPic: DataTypes.STRING,
    profilePic: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};