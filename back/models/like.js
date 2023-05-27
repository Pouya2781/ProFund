'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
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
  Like.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes'
  });
  return Like;
};