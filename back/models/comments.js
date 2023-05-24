'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Projects, Replies}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.belongsTo(Projects, {foreignKey: "projectId"})
      this.hasMany(Replies, {foreignKey: "commentId"})
    }
  }
  comments.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};