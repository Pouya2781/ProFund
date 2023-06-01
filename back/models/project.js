'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, ProjectDescription, Token, Donate, Comment, Like}) {
      // define association here
      this.belongsTo(User, {foreignKey: "userId"})
      this.hasOne(ProjectDescription, {foreignKey: "projectId"})
      this.hasMany(Token, {foreignKey: "projectId"})
      this.hasMany(Donate, {foreignKey: "projectId"})
      this.hasMany(Comment, {foreignKey: "projectId"})
      this.hasMany(Like, {foreignKey: "projectId"})
    }
  }
  Project.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    goal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investedAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    investorCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hasDonate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hasToken: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    // creating1, creating2, creating3, pending approval, active, pending payment, pending delivery, done, expired
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects'
  });
  return Project;
};