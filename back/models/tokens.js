'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Projects, Invests}) {
      // define association here
      this.belongsTo(Projects, {foreignKey: "projectId"})
      this.hasMany(Invests, {foreignKey: "tokenId"})
    }
  }
  tokens.init({
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
    modelName: 'tokens',
  });
  return tokens;
};