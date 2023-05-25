'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Project, Invest}) {
      // define association here
      this.belongsTo(Project, {foreignKey: "projectId"})
      this.hasMany(Invest, {foreignKey: "tokenId"})
    }
  }
  Token.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    limit:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens'
  });
  return Token;
};