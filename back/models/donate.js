'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Project, User}) {
      // define association here
      this.belongsTo(Project, {foreignKey: "projectId"})
      this.belongsTo(User, {foreignKey: "userId"})
    }
  }
  Donate.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Donate',
    tableName: 'donates'
  });
  return Donate;
};