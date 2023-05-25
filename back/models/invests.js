'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Tokens}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.belongsTo(Tokens, {foreignKey: "tokenId"})
    }
  }
  invests.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'invests',
  });
  return invests;
};