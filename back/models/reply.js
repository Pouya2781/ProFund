'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Comment, User}) {
      // define association here
      this.belongsTo(Comment, {foreignKey: "commentId"})
      this.belongsTo(User, {foreignKey: "userId"})
    }
  }
  Reply.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'replies'
  });
  return Reply;
};