'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Token}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.belongsTo(Token, {foreignKey: "tokenId"})
    }
  }
  Invest.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Invest',
    tableName: 'invests'
  });
  return Invest;
};