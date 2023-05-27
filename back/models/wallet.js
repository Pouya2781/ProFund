'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Payment}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.hasMany(Payment, {foreignKey: "walletId"})
    }
  }
  Wallet.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallets'
  });
  return Wallet;
};