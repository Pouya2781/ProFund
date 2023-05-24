'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Payments}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.hasMany(Payments, {foreignKey: "walletId"})
    }
  }
  wallet.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creation_date: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'wallet',
  });
  return wallet;
};